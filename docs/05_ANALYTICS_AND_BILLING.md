# Analytics Engine, SaaS Subscriptions & Growth Strategy

> **Document Purpose:** Specifications for background analytics pre-aggregation, Celery job scheduling, SaaS subscription pricing strategy, landing page layout, and growth hooks for the Lucknow beta launch.

---

## 1. Analytics & Pre-Aggregated Reporting Engine

### 1.1 Performance Rationale
Running live aggregation queries (`SUM`, `COUNT`, `GROUP BY`) across millions of transactional order records during peak dining hours degrades database response times. To guarantee dashboard load times under 1 second, financial and sales aggregations are pre-calculated via Celery background workers into dedicated summary tables.

### 1.2 Summary Tables & Schedules
- **`analytics_daily_outlet_sales`:** Aggregates daily order count, total revenue, dine-in revenue, takeaway revenue, and cancellations per outlet.
- **`analytics_daily_item_sales`:** Aggregates quantity sold and total revenue per item variant per outlet.
- **Celery Schedule:** Runs every 15 minutes during operating hours and performs a full reconciliation wrap-up at midnight.

### 1.3 Executive Reporting Dashboards
1. **Real-time Today KPIs:** Today's Total Revenue, Order Volume, Active Dine-In Tables, Average Order Value (AOV), Pending KOTs.
2. **Sales Analytics Filters:** Daily, Weekly, Monthly, Custom Range. Breakdown by Total Business vs Outlet Comparison.
3. **Item Matrices:** Top 10 Best Sellers (by revenue & volume), Bottom 10 Low Sellers, Variant Split (Full vs Half sales ratio).

---

## 2. SaaS Subscription Tiers & Pricing Model

To capture market share rapidly during the Lucknow launch, the platform uses a **Freemium Acquisition Strategy**:

| Subscription Tier | Price (INR) | Max Outlets | Daily Order Limit | Target Segment | Included Key Features |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Starter (Free)** | **₹0 / Free Lifetime** | 1 Outlet | 100 Orders / Day | Small cafes, QSRs, food trucks | QR Menu, Dine-In & Takeaway, Counter POS, Basic Reports |
| **Growth** | **₹299 / month** | 2 Outlets | 300 Orders / Day | Busy single-unit restaurants | Multi-outlet cloning, Custom receipts, Advanced analytics |
| **Scale** | **₹699 / month** | 5 Outlets | 1,000 Orders / Day | Multi-branch dining chains | Priority support, Excel export, Custom domain mapping |
| **Pro** | **₹1,499 / month** | 10 Outlets | 3,000 Orders / Day | Large restaurant groups, pubs | KDS Integration, Dedicated account manager, SMS notifications |
| **Enterprise** | Custom Quote | Unlimited | Unlimited | Large food courts, franchises | Custom API integrations, SLA guarantees, On-site training |

---

## 3. Landing Page & Growth Specs

### 3.1 Content Structure
1. **Hero Section:**
   - **Headline:** *Transform Your Restaurant with QR & Counter Ordering in 5 Minutes.*
   - **Subheadline:** *Manage digital menus, table QR orders, takeaway, and multi-outlet pricing from a single fast cloud platform.*
   - **CTAs:** `[Start Free Lifetime Plan]` | `[View Live Demo Menu]`

2. **Interactive Demo Hook:**
   - Embed a sample QR code directly in the hero banner. Scanning loads a live demo menu ("Royal Awadhi Cuisine Demo Store") to demonstrate lightning speed and clean mobile UI to prospective restaurant owners.

3. **Feature Grid:**
   - *Instant QR Menus:* Zero app downloads required.
   - *Smart Weight & Portion Pricing:* Sweets by weight (100g/250g/1kg) and non-proportional variants (Full/Half).
   - *Dual Engine:* QR scanning alongside Cashier Counter POS walk-ins.
   - *Multi-Outlet Synchronization:* Push updates across outlets or set local store overrides.

4. **Lucknow Launch Offer Banner:**
   - *"Beta Launch Offer: Get Lifetime Free Access for 1 Outlet (Up to 100 Orders/Day). No Credit Card Required!"*
