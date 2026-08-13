# Roadmap, Execution Plan & Non-Functional Requirements (NFR)

> **Document Purpose:** 6-week MVP execution timeline, non-functional requirements, security controls, rate limiting rules, and Docker Compose deployment blueprint.

---

## 1. 6-Week Execution Roadmap

```
Week 1: Core Foundation & Multi-Tenancy Architecture
├── Django project setup, custom Organization & User models
├── TenantMiddleware & row-level tenant isolation safeguards
└── Base PostgreSQL schema migrations & admin interfaces

Week 2: Master Menu & Explicit Variant Engine
├── Category hierarchy & item tag mapping
├── Portion & weight-based variant pricing engine
└── Outlet-level price overrides & 1-click cloning wizard

Week 3: QR Code Engine & Customer Web App
├── Store ID + Numeric Table QR generation (`/o/<outlet>/t/<table_number>`)
├── Mobile-first customer web ordering interface (Alpine.js)
└── Cart management, item notes, & order placement AJAX endpoints

Week 4: Counter POS & Kitchen Display System (KDS)
├── Cashier POS walk-in order creation & payment logging
├── Thermal printer KOT generation engine
└── Live KDS order status queue & WebSocket/polling state updates

Week 5: Analytics Engine & SaaS Billing Integration
├── Pre-aggregated daily sales & item performance Celery workers
├── Executive dashboard KPI metrics & outlet sales breakdown
└── Subscription tier management (First 100 Customers Limited Offer)

Week 6: Testing, NFR Hardening & Pan India Deployment
├── Load testing (locust performance benchmarking under peak load)
├── Security audit (rate limiting, tenant boundary penetration test)
└── Production VPS deployment via Docker Compose + Nginx SSL
```

---

## 2. Non-Functional Requirements (NFR) & Latency SLAs

| Metric | Target SLA | Implementation Strategy |
| :--- | :--- | :--- |
| **Public QR Menu Load** | `< 50ms` | Serialized JSON stored in Redis cache per outlet (`tenant:{org}:outlet:{id}:menu`). |
| **Customer Order Creation** | `< 100ms` | Lightweight Django view, single atomic DB transaction, async KOT queue push. |
| **KDS Live Update Latency** | `< 50ms` | Polling or WebSocket event broadcast to kitchen staff screens. |
| **Analytics Dashboard Load** | `< 1.0s` | Dashboard reads strictly from pre-aggregated summary tables (`analytics_dailyoutletsales`). |
| **Database Uptime** | `99.9%` | Single VPS PostgreSQL 16 container with automated daily volume backups. |

---

## 3. Security & Rate Limiting Controls

1. **Rate Limiting:**
   - Public QR endpoints (`/o/<outlet>/...`): Max 60 requests per minute per IP to prevent DDoS scraping.
   - Authentication endpoints (`/login/`, `/quick-signup/`): Max 5 attempts per minute to prevent brute-force attacks.
2. **Data Scoping:**
   - Every ORM query automatically scoped to authenticated `organization_id`.
   - Explicit cross-tenant decorator verification on all API endpoints (`403 Forbidden` on mismatch).
3. **Session & Transport Security:**
   - HTTPS enforced via Nginx TLS 1.3 encryption.
   - `Secure`, `HttpOnly`, and `SameSite=Lax` cookie flags enabled in production.
   - Strict Content Security Policy (CSP) headers protecting against XSS attacks.

---

## 4. Production Deployment Setup (Docker Compose Spec)

```yaml
version: '3.8'

services:
  web:
    build: .
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
    volumes:
      - static_volume:/app/static
      - media_volume:/app/media
    env_file:
      - .env
    depends_on:
      - db
      - redis

  celery_worker:
    build: .
    command: celery -A config worker -l info
    env_file:
      - .env
    depends_on:
      - db
      - redis

  celery_beat:
    build: .
    command: celery -A config beat -l info
    env_file:
      - .env
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: restrohub_db
      POSTGRES_USER: restrohub_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - static_volume:/app/static
      - media_volume:/app/media
    depends_on:
      - web

volumes:
  postgres_data:
  redis_data:
  static_volume:
  media_volume:
```
