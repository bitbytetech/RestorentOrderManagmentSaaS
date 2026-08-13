# Product Requirements Document (PRD) & System Vision

> **System Name:** Multi-Tenant Restaurant Order Management SaaS Platform (Beta Target: Lucknow)  
> **Document Version:** 1.0 (Production Blueprint)  
> **Target Architecture:** Modular Django Monolith with PostgreSQL, Redis, Alpine.js, & Bootstrap 5  
> **Deployment Target:** Single VPS Containerized Setup (Ubuntu / Docker Compose / Nginx)

---

## 1. Executive Summary & Vision

### 1.1 Overview
The **Multi-Tenant Restaurant Order Management SaaS Platform** is a multi-outlet cloud solution engineered specifically for modern food and beverage (F&B) establishments. It catres to a wide spectrum of formats:
- Fine-Dining Restaurants
- Quick-Service Restaurants (QSRs)
- Cafes & Coffee Shops
- Sweet Shops & Bakeries (requires weight-based pricing)
- Cloud Kitchens & Dark Kitchens
- Pubs, Bars & Lounges

The platform unifies **digital QR menu ordering**, **cashier counter POS ordering**, **multi-outlet menu synchronization**, **non-proportional and weight-based variant pricing**, **real-time order lifecycle tracking (KDS)**, and **pre-aggregated analytics** into a single fast, cloud-hosted modular system.

---

## 2. Strategic Objectives & Core Value Propositions

### 2.1 Frictionless Customer QR Ordering
- **Zero App Download:** Instant access via QR scan directly in standard mobile web browsers (Safari, Chrome, Firefox).
- **Dual Support:** Supports both **Dine-In** table ordering and **Takeaway** collection flows.
- **Sub-100ms Menu Load:** Instant page rendering leveraging Redis cached JSON payloads.

### 2.2 Counter & Walk-in Ordering (Cashier POS)
- **Fast Walk-in Order Entry:** Cashier interface optimized for speed, supporting keyboard navigation and rapid item selection.
- **Kitchen Order Ticket (KOT) Generation:** Automatic or manual KOT printing upon order confirmation.
- **Integrated Payment Recording:** Track payments across Cash, UPI, Card, and Pay-Later methods.

### 2.3 Flexible Variant & Weight-Based Pricing Engine
- **Non-Proportional Portion Pricing:** Support real-world F&B scenarios where half-portions are not mathematically 50% of full-portions (e.g., Full Noodles ₹120, Half Noodles ₹75).
- **Weight-Based Sweets/Bakery Selling:** Direct support for weight options (e.g., Kaju Katli: 100g = ₹120, 250g = ₹300, 1000g = ₹1150).

### 2.4 Multi-Outlet Chain Management
- **Central Master Menu:** Chain owners maintain a single master catalog at the Organization (Tenant) level.
- **Outlet Overrides:** Outlet managers can override pricing or toggle item availability ("In Stock" / "Sold Out") per location.
- **Outlet Cloning Wizard:** One-click replication of entire menu setups across outlets.

### 2.5 Cost-Effective Monolithic Scalability
- **Low Infrastructure Overhead:** Designed to run efficiently on a modest VPS (4 vCPU / 8 GB RAM) capable of serving high concurrent peak-hour traffic during the Lucknow beta deployment.

---

## 3. Scope of the System

| Module | Features Included in Scope |
| :--- | :--- |
| **Tenants & Outlets** | Organization registration, mandatory first outlet creation, multi-outlet expansion, store parameters. |
| **Authentication & RBAC** | Multi-role user management (Super Admin, Owner, Manager, Cashier, Kitchen KDS, Customer). |
| **Menu Management** | Categories (hierarchical), Tags (multi-select filters), Items, Explicit Variants, Store Overrides, Cloning. |
| **Dynamic QR Codes** | Table-specific and Takeaway QR generation, table edit policy enforcement (`STRICT_ENFORCED` vs `CUSTOMER_EDITABLE`). |
| **Ordering Engines** | Customer Mobile QR Web App + Cashier Counter POS Interface. |
| **Order Lifecycle** | Real-time state machine (`PLACED` → `CONFIRMED` → `PREPARING` → `READY` → `DELIVERED` / `CANCELLED`). |
| **Kitchen Display (KDS)** | Kitchen order dashboard with real-time status updates and KOT printing. |
| **Analytics Engine** | Pre-aggregated daily sales tables, Executive KPIs, Store performance comparisons, Top/Low selling items. |
| **SaaS Subscriptions** | Tiered billing plans (Starter Lifetime Free, Growth, Scale, Pro, Enterprise). |
