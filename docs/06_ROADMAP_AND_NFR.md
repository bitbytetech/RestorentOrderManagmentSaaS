# Implementation Roadmap & Non-Functional Requirements

> **Document Purpose:** 6-week execution roadmap, performance SLAs, security policies, data isolation guarantees, rate limiting, and containerized deployment specifications.

---

## 1. MVP Implementation Roadmap (6-Week Target)

```
+-----------------------------------------------------------------------------------+
| WEEK 1-2: Core Architecture & Schema Setup                                        |
| - Django Modular Monolith apps (`accounts`, `tenants`, `menu`, `orders`, `tables`)|
| - PostgreSQL schema migration & Model Manager Tenant scoping implementation       |
| - Authentication & RBAC role permission decorators                                |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| WEEK 3-4: Menu Engine & Order Flows                                               |
| - Flexible Variant Pricing Engine (Full/Half, Weight Units)                       |
| - Outlet Menu Override & Cloning Wizard                                           |
| - Mobile QR Ordering Interface (Bootstrap 5 + Alpine.js cart reactivity)          |
| - Counter POS Cashier Interface & KOT generation                                  |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| WEEK 5-6: Analytics, Redis Caching & Deployment                                   |
| - Redis Caching layer for public outlet menus                                     |
| - Pre-aggregated daily reporting background tasks via Celery                       |
| - Nginx, Gunicorn, Docker Compose setup on Lucknow Beta VPS                       |
| - Landing page launch & onboarding initial restaurant pilot cohort                 |
+-----------------------------------------------------------------------------------+
```

---

## 2. Non-Functional Requirements (NFRs)

### 2.1 Performance SLAs
- **Menu Response Latency:** Sub-50ms HTTP response for public customer QR menu loads via Redis cached JSON.
- **Counter POS Order Creation:** Sub-200ms processing latency for cashier order submission and KOT generation.
- **Reporting Dashboards:** All analytics and executive KPI pages must render in < 1 second using pre-aggregated tables.

### 2.2 Security Controls
- **Password Hashing:** Django default Argon2 / PBKDF2 with HMAC-SHA256.
- **Strict Row Scoping:** All ORM database queries automatically appended with `organization_id` context.
- **Input Sanitization:** XSS and SQL injection protection across customer notes and item descriptions.
- **Order Anti-Spam Rate Limiting:** Redis-backed rate limiter on QR order submission endpoints restricting max 5 orders per customer mobile number per 10 minutes.

### 2.3 Deployment Architecture
- **Single VPS Infrastructure:** 4 vCPU, 8 GB RAM Linux VPS (Ubuntu).
- **Containerization:** Docker Compose orchestrating:
  - `web` (Django WSGI Gunicorn container)
  - `celery_worker` (Background reporting worker)
  - `celery_beat` (Scheduled task runner)
  - `db` (PostgreSQL 16)
  - `redis` (Redis 7 cache & broker)
  - `nginx` (Nginx SSL reverse proxy & static file server)
