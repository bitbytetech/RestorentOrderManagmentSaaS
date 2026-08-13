# System Architecture & Multi-Tenancy Design

> **Document Purpose:** Detailed technical blueprint of system architecture, technology stack justifications, multi-tenant row-level data isolation, and caching strategies.

---

## 1. System Architecture Diagram

```
+-------------------------------------------------------------------+
|                           CLIENT LAYER                            |
|             Bootstrap 5.3 + Alpine.js 3.x (Lightweight UI)        |
|     (Customer QR Web App / Owner Portal / Cashier POS / KDS)      |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                    NGINX REVERSE PROXY & SSL                      |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                        DJANGO WSGI / ASGI                         |
|                   (Modular Monolith Framework)                    |
+-------------------------------------------------------------------+
  /                   |                     |                    \
 v                    v                     v                     v
+-----------------+ +-----------------+ +-------------------+ +-----------------+
|  Accounts App   | |    Menu App     | |    Orders App     | | Analytics App   |
| Tenant & Outlet | | Variant Engine  | | QR & Counter POS  | | Pre-Aggregates  |
+-----------------+ +-----------------+ +-------------------+ +-----------------+
  \                   |                     |                    /
   v                  v                     v                   v
+-------------------------------------------------------------------+
|                      PERSISTENCE & CACHING                        |
| - PostgreSQL 16 (Primary DB + Row-Level Tenant Isolation)         |
| - Redis 7 (Serialized Menu Cache & Celery Queue)                  |
+-------------------------------------------------------------------+
```

---

## 2. Technology Stack Justification

### 2.1 Backend Framework: Python 3.12 / Django 5.x
- **Modular Monolith Architecture:** Keeps app boundaries clean (`accounts`, `tenants`, `menu`, `orders`, `tables`, `analytics`, `billing`) without microservice overhead.
- **ORM & Admin:** Out-of-the-box administrative tooling, schema migration management, and expressive database query abstractions.
- **Security:** Built-in safeguards against CSRF, SQL injection, XSS, and session hijacking.

### 2.2 Database: PostgreSQL 16+
- **Row-Level Shared Multi-Tenancy:** Single database with strict foreign-key tenant scoping (`organization_id`).
- **JSONB Support:** Efficient storage for extensible variant metadata and snapshots.
- **Indexing Performance:** Partial and composite index capabilities for high-frequency order lookups.

### 2.3 Frontend Interactivity: Alpine.js 3.x
- **Lightweight Reactivity:** Direct HTML attribute binding without build step complexities.
- **Micro-Payload:** Keeps total page download size under 50KB for rapid 3G/4G mobile QR scans.
- **Dynamic State:** Handles shopping cart item counts, variant options, pricing totals, and live polling for kitchen state changes.

### 2.4 UI Framework: Bootstrap 5.3
- **Responsive Grid:** Utility-first CSS classes providing seamless layouts across mobile smartphones, POS touch tablets, and desktop monitors.

### 2.5 Cache & Queue: Redis 7 + Celery 5.x
- **Menu Cache:** Caches serialized public menus per outlet for sub-50ms customer response times.
- **Async Tasks:** Offloads heavy sales reporting aggregations and periodic tasks outside the HTTP request/response cycle.

---

## 3. Multi-Tenant Architecture & Domain Scoping

### 3.1 Data Scoping Hierarchy

```
[ Organization / Tenant ] (e.g., Royal Awadhi Cuisine Group)
├── Tenant Admin (Owner)
├── Master Menu Catalog (Categories, Items, Tags, Variants)
├── SaaS Subscription Tier (e.g., Growth Plan)
│
├── [ Outlet 1: Hazratganj ]
│     ├── Outlet Manager, Cashier, Kitchen Staff
│     ├── Tables (Display: T1, T2, T3... | Numeric DB ID: 1, 2, 3...)
│     ├── Price Overrides & Item Availability Flags
│     └── Orders (QR + Counter POS)
│
└── [ Outlet 2: Gomti Nagar ]
      ├── Tables (Display: T1, T2, T3... | Numeric DB ID: 1, 2, 3...)
      ├── Price Overrides & Item Availability Flags
      └── Orders (QR + Counter POS)
```

### 3.2 Tenant Isolation Safeguards

1. **Custom `TenantAwareModel` Base Class:**
   All multi-tenant models inherit from a base model that enforces `organization_id` on querysets via a custom Django `TenantManager`.

   ```python
   class TenantAwareModel(models.Model):
       organization = models.ForeignKey('tenants.Organization', on_delete=models.CASCADE)

       objects = TenantManager()

       class Meta:
           abstract = True
   ```

2. **Middleware Thread Context (`TenantMiddleware`):**
   - Resolves tenant context from URL path parameters (`/o/<outlet_slug>/...`) or authenticated user session.
   - Stores current `organization_id` in thread-local storage.
   - Automatically scopes ORM read/write queries to the active tenant context.

3. **Cross-Tenant Guard Decorator:**
   API endpoints validate that requested `outlet_id` or `order_id` belongs strictly to the authenticated user's `organization_id`. Any attempt to cross access throws an immediate `403 Forbidden` response.

### 3.3 Table Naming, Storage & QR Code Specification

1. **Numeric Database Storage:**
   Actual table identifiers stored in the database (`tables_table.table_number`) are strictly **numeric** integers (e.g., `1`, `2`, `3`).
2. **Standardized Display Naming:**
   For all outlets, table names in the UI, Cashier POS, Kitchen Display System (KDS), receipts, and customer mobile web apps are consistently presented as `T1`, `T2`, `T3`... (prefixed with `T`).
3. **QR Code Encoding:**
   QR codes are generated using a combination of the **Store Identifier** (`outlet_slug` or `outlet_id`) and the **Numeric Table Number** (`table_number`), e.g., `https://<domain>/o/<outlet_slug>/t/<table_number>`. This guarantees unique table identification across multi-outlet tenants while preserving standard numeric schema design.

---

## 4. Performance & Caching Architecture

### 4.1 Public Menu Redis Caching
- **Cache Key Format:** `tenant:{org_id}:outlet:{outlet_id}:menu`
- **Cache Invalidation Triggers:**
  - Item update or price change in Master Menu.
  - Availability toggle ("Sold Out" / "In Stock") at Outlet level.
  - Category or tag modification.

### 4.2 Database Pre-Aggregation
- Financial aggregations run asynchronously via Celery into dedicated analytics summary tables (`analytics_daily_outlet_sales`, `analytics_daily_item_sales`).
- Dashboard queries read directly from pre-aggregated tables, keeping load times strictly under 1 second.
