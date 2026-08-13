# Multi-Tenant Restaurant Order Management SaaS Platform

> **Beta Target:** Lucknow F&B Market  
> **Architecture:** Modular Django Monolith with PostgreSQL 16, Redis 7, Alpine.js 3, & Bootstrap 5.3  
> **Deployment Target:** Single VPS Containerized Setup (Ubuntu / Docker Compose / Nginx)

---

## 📌 Executive Summary

The **Multi-Tenant Restaurant Order Management SaaS Platform** is a multi-outlet cloud solution tailored for modern food establishments including fine-dining restaurants, quick-service restaurants (QSRs), cafes, sweet shops, bakeries, cloud kitchens, and pubs. It provides seamless **digital QR menu ordering** for customers, an integrated **Cashier Counter POS** for walk-in orders, an **Explicit Variant Pricing Engine** supporting portion and weight-based pricing (e.g. 100g, 250g, Full/Half), **Multi-Outlet menu synchronization & overrides**, and **pre-aggregated real-time analytics**.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose & Justification |
| :--- | :--- | :--- |
| **Backend Framework** | Python 3.12 / Django 5.x | Modular monolith architecture, robust ORM, built-in admin, secure authentication |
| **Database** | PostgreSQL 16+ | Shared-database multi-tenancy (`organization_id` scoping), JSONB support, strict foreign keys |
| **Frontend Interactivity** | Alpine.js 3.x | Reactive UI for shopping cart, variant selection, KDS & live order status polling without heavy SPA overhead |
| **UI Styling** | Bootstrap 5.3 | Mobile-first responsive layout for QR web app, cashier POS, and admin dashboards |
| **Caching & Queues** | Redis 7 + Celery 5.x | Sub-50ms serialized JSON menu caching & async reporting tasks |
| **Web Server / Reverse Proxy** | Nginx + Gunicorn | Containerized deployment via Docker Compose on Linux VPS |

---

## 🏛️ System Architecture

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

## 📂 Project Structure Blueprint

```
RestorentOrderManagmentSaaS/
├── docs/                                 # Structured Architecture & Requirement Specifications
│   ├── 01_PRODUCT_REQUIREMENTS.md       # Product Vision, Goals & Onboarding Specs
│   ├── 02_ARCHITECTURE_AND_MULTI_TENANCY.md # Multi-Tenant Row Isolation, Middleware & Stack Setup
│   ├── 03_DATABASE_SCHEMA.md            # Complete Production-Ready PostgreSQL DDL & ERD
│   ├── 04_FUNCTIONAL_SPECIFICATIONS.md  # Detailed QR Engine, Counter POS, Menu Variants & RBAC
│   ├── 05_ANALYTICS_AND_BILLING.md      # Celery Pre-Aggregated Reporting & SaaS Subscription Tiers
│   └── 06_ROADMAP_AND_NFR.md            # 6-Week MVP Milestones, SLAs, Security & Rate Limiting
├── RquirmentDocument.txt                 # Legacy Source Requirements Document
└── README.md                             # Project Overview & Index (This File)
```

---

## 📚 Documentation Index

For full technical specifications and implementation guidelines, refer to the documents in the [`docs/`](file:///Users/ankit/MyData/BpstProducts/RestorentOrderManagmentSaaS/docs) directory:

1. 📄 [01. Product Requirements Document](file:///Users/ankit/MyData/BpstProducts/RestorentOrderManagmentSaaS/docs/01_PRODUCT_REQUIREMENTS.md) — Product vision, target establishment types, and Lucknow launch strategy.
2. 📄 [02. Architecture & Multi-Tenancy](file:///Users/ankit/MyData/BpstProducts/RestorentOrderManagmentSaaS/docs/02_ARCHITECTURE_AND_MULTI_TENANCY.md) — Technical stack, row-level multi-tenancy safeguards, middleware, and caching layers.
3. 📄 [03. Database Schema Specification](file:///Users/ankit/MyData/BpstProducts/RestorentOrderManagmentSaaS/docs/03_DATABASE_SCHEMA.md) — Production-ready SQL DDL, table relationships, foreign keys, and indexes.
4. 📄 [04. Functional Specifications](file:///Users/ankit/MyData/BpstProducts/RestorentOrderManagmentSaaS/docs/04_FUNCTIONAL_SPECIFICATIONS.md) — RBAC matrix, Explicit Variant Pricing Engine, dynamic QR tables, Counter POS & KOT flow.
5. 📄 [05. Analytics & SaaS Billing](file:///Users/ankit/MyData/BpstProducts/RestorentOrderManagmentSaaS/docs/05_ANALYTICS_AND_BILLING.md) — Pre-aggregated analytics models, Celery tasks, SaaS pricing tiers, and landing page specs.
6. 📄 [06. Roadmap & Non-Functional Requirements](file:///Users/ankit/MyData/BpstProducts/RestorentOrderManagmentSaaS/docs/06_ROADMAP_AND_NFR.md) — 6-week execution plan, latency SLAs, security controls, and rate limiting rules.

---

## 🚀 Key System Features

- **Dynamic QR Code Ordering & Table Management:** Store ID + Numeric Table Number QR encoding (`/o/<outlet_slug>/t/<table_number>`). Tables displayed standard as `T1`, `T2`, `T3`... across all outlets with numeric integer storage in PostgreSQL.
- **Counter POS & Cashier Desk:** Fast walk-in order creation, customer mobile capture, split/cash/UPI payment recording, and instant KOT generation.
- **Explicit Variant Engine:** Non-proportional price support (Full ₹120 / Half ₹75) and weight-based units (`gram`, `kilogram`, `full`, `half`, `plate`, `piece`, `liter`, `ml`).
- **Multi-Outlet Synchronization:** Centralized Master Menu with store-level price overrides and availability toggling ("In Stock" / "Sold Out").
- **Sub-50ms Performance:** Redis-cached public menus and Celery pre-aggregated sales data for sub-second dashboard reporting.
- **Multi-Tenant Row Isolation:** Strict `organization_id` model scoping backed by Django middleware thread locals.
