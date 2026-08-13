# Analytics Engine, SaaS Subscriptions & Growth Strategy

> **Document Purpose:** Specifications for background analytics pre-aggregation, Celery job scheduling, SaaS subscription pricing strategy, landing page layout, and growth hooks for the Pan India market launch.

---

## 1. Analytics & Metrics Engine

### 1.1 Pre-Aggregated Summary Architecture
To ensure high-performance analytics dashboards, RestroHub avoids running heavy aggregate SQL queries (`SUM`, `COUNT`, `GROUP BY`) directly against raw transactional tables (`orders_order`, `orders_orderitem`) on every HTTP request.

Instead, the system relies on **Pre-Aggregated Sales Summary Tables** updated asynchronously via Redis + Celery worker tasks or database triggers.

#### Key Aggregated Tables:
1. `analytics_dailyoutletsales`:
   - `organization_id` (UUID)
   - `outlet_id` (UUID)
   - `date` (DATE)
   - `total_orders` (INT)
   - `gross_revenue` (NUMERIC)
   - `net_revenue` (NUMERIC)
   - `dine_in_revenue` (NUMERIC)
   - `takeaway_revenue` (NUMERIC)
   - `average_order_value` (NUMERIC)

2. `analytics_itemperformancesummary`:
   - `organization_id` (UUID)
   - `outlet_id` (UUID)
   - `item_id` (UUID)
   - `quantity_sold` (INT)
   - `total_item_revenue` (NUMERIC)
   - `last_updated_at` (TIMESTAMP)

---

## 2. SaaS Subscription & Billing Tiers

To capture market share rapidly across India, the platform uses a **Freemium Acquisition Strategy** with a limited-time offer for early adopters:

### 2.1 Pricing Tier Structure

| Tier | Price | Included Outlets | Daily Order Limit | Core Features | Target Audience |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Starter (Limited Offer)** | **₹0 / Month** (Lifetime Free) | 1 Outlet | **100 Orders / Day** | Basic QR menu, POS counter order logging, single-outlet KOT, basic analytics. | First 100 restaurant signups across India. |
| **Growth (Popular)** | **₹699 / Month** (₹559/mo Billed Annually) | Up to 2 Outlets | **500 Orders / Day** | All Starter features + multi-outlet central management, item availability sync, advanced analytics, priority WhatsApp support. | Established single & dual-outlet restaurants, busy cafes. |
| **Professional** | **₹1,499 / Month** (₹1,199/mo Billed Annually) | Up to 5 Outlets | **1,000 Orders / Day** | All Growth features + 1-click menu cloning across stores, outlet comparison analytics, global tag sync, dedicated account manager. | Growing multi-outlet restaurant chains, cloud kitchen groups. |

---

## 3. High-Converting Landing Page Architecture

The RestroHub landing page is benchmarked against Toast, Petpooja, and Posist:

1. **Top Announcement Bar:**
   - Highlights the limited-time acquisition offer: *"🔥 Limited Time Offer: Get 100 Free Orders/Day Lifetime Free for 1 Outlet (First 100 Customers Across India!)."*

2. **Hero Section:**
   - **Headline:** *Manage Menus, Orders & Outlets from One Dashboard*
   - **Badges:** `Multi-Outlet Ready` • `No App Download` • `Live Order Tracking`
   - **Mockup:** Interactive dashboard preview showing real-time store metrics.

3. **Problem vs. Solution Section:**
   - Highlights manual order delays vs. instant QR ordering and live stock toggling.

4. **Pan India Launch Offer Banner:**
   - Prominent conversion card reinforcing the 100 free daily orders lifetime offer for the first 100 customers across India.
