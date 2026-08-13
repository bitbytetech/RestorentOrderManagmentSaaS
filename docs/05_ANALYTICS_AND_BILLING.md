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

4. **Pan India Launch Offer Banner:**
   - *"Limited Time Offer: Get Lifetime Free Access for 1 Outlet (Up to 100 Orders/Day) for the First 100 Customers Across India. No Credit Card Required!"*
