# Detailed Functional Specifications

> **Document Purpose:** Complete specification of Roles & Access Control (RBAC), Explicit Variant Pricing Engine, Multi-Outlet Sync & Overrides, Dynamic QR Tables, Dual Ordering Engines (QR & Counter POS), and Order State Machine.

---

## 1. Role-Based Access Control (RBAC) Matrix

| Role | Access Scope | Key Permissions & Responsibilities |
| :--- | :--- | :--- |
| **Super Admin** | Platform-wide | Manages tenant organization accounts, SaaS subscription tiers, system maintenance, and platform metrics. |
| **Restaurant Owner** | Organization-wide (All Outlets) | Manages business profile, creates master catalog items/variants, sets store prices, runs outlet cloning wizard, manages billing, views organizational financial reports. |
| **Outlet Manager** | Assigned Outlet(s) | Toggles item availability ("In Stock" / "Sold Out"), overrides local prices, manages table configurations, manages cashier user accounts, views outlet sales performance. |
| **Cashier / Counter Operator** | Assigned Outlet | **Counter POS Interface:** Creates walk-in orders, captures customer mobile numbers, accepts Cash/UPI/Card payments, triggers KOT generation, updates order status. |
| **Kitchen Staff (KDS)** | Assigned Outlet | **Kitchen Display System Interface:** Views incoming live orders (`PLACED`, `PREPARING`), updates kitchen item readiness state (`READY`), prints physical KOTs. No price/financial access. |
| **Customer** | Dynamic Session | Scans table or takeaway QR code. Enters 10-digit mobile number for order lookup. Explores menu, selects variants, places order, tracks real-time status. |

---

## 2. Onboarding & Multi-Outlet Setup Flow

```
[ Owner Registration ]
        │
        ▼
[ Enter Mobile + OTP Verification ]
        │
        ▼
[ Create Organization Profile ]
        │
        ▼
[ Mandatory Wizard: Create Outlet #1 ]
        │
        ▼
[ Access Owner Dashboard ]
        │
        ▼
[ Add Master Menu / Categories / Variants ]
        │
        ▼
[ Clone or Add Additional Outlets (Up to Tier Limit) ]
```

---

## 3. Explicit Variant & Unit Pricing Engine

### 3.1 Architecture Specification
Rather than using simple mathematical percentage multipliers (which break down for real-world F&B pricing), the platform uses an **Explicit Variant Model**:
1. **Flat Items:** Mineral Water ₹20 (single default variant).
2. **Sized Portion Variants:** Full Noodles ₹120, Half Noodles ₹75 (non-proportional custom pricing).
3. **Weight & Unit Variants:** Kaju Katli → 100g = ₹120, 250g = ₹300, 1000g = ₹1150.
4. **Supported Unit Types:** `full`, `half`, `quarter`, `piece`, `plate`, `bowl`, `glass`, `gram`, `kilogram`, `liter`, `ml`.

### 3.2 Outlet Menu Overrides & Cloning
- **Master Repository:** Items and default variant prices are created at Organization level.
- **Outlet Overrides (`menu_outlet_override`):**
  - **Availability Toggle:** Mark variant as "In Stock" or "Sold Out" per outlet.
  - **Price Override:** Charge ₹150 for Full Noodles in an Airport outlet vs ₹120 in a High Street outlet.
- **Outlet Cloning Wizard:** Copies complete category hierarchies, item tags, variants, and override prices from Outlet A to Outlet B in 1 click.

---

## 4. QR Code & Table Management System

### 4.1 URL Structure
- **Table Specific Dine-In QR:** `https://<domain>/o/<outlet_slug>/t/<table_code>`
- **Takeaway QR:** `https://<domain>/o/<outlet_slug>/takeaway`

### 4.2 Table Policy Enforcement Modes
- **`STRICT_ENFORCED`:** Customer cannot modify the table number detected from the scanned QR code.
- **`CUSTOMER_EDITABLE`:** Customer can modify or select their table number from a dropdown interface (ideal for open-patio or poolside dining).

---

## 5. Dual Ordering Engines (QR & Counter POS)

```
                       +------------------------------------------+
                       |             ORDER INITIATION             |
                       +------------------------------------------+
                                    /                \
                                   /                  \
              +-----------------------+            +-----------------------+
              | Flow A: Customer QR   |            | Flow B: Counter POS   |
              | (Dine-In / Takeaway)  |            | (Cashier Walk-in)     |
              +-----------------------+            +-----------------------+
                          |                                    |
                          v                                    v
              Status: [ PLACED ]                   Status: [ CONFIRMED ]
                          |                                    |
                          +-----------------+------------------+
                                            |
                                            v
                                +-----------------------+
                                | Status: [ PREPARING ] | (Kitchen KDS View)
                                +-----------------------+
                                            |
                                            v
                                +-----------------------+
                                | Status: [ READY ]     | (Pickup / Serve Alert)
                                +-----------------------+
                                            |
                                            v
                                +-----------------------+
                                | Status: [ DELIVERED ] | (Order Closed)
                                +-----------------------+
```

### 5.1 Flow A: Customer QR Ordering
1. Customer scans table/takeaway QR code.
2. Web page resolves `outlet_id` and `table_code`.
3. Customer enters 10-digit mobile number (stored in session storage).
4. Customer selects categories/tags, chooses portion/weight variants, adds notes.
5. Cart submitted via AJAX/Alpine fetch. Order created with status `PLACED`.
6. Live order status tracking page opens (`Placed` → `Preparing` → `Ready` → `Delivered`).

### 5.2 Flow B: Cashier Counter POS
1. Cashier opens desktop/tablet POS interface.
2. Selects order type (`Dine-In` with table picker OR `Takeaway` / `Counter`).
3. Captures customer mobile number (autocompletes returning customer name).
4. Rapidly adds variants to cart, applies optional order discount.
5. Selects payment method (`Cash`, `UPI`, `Card`, `Pay Later`) and payment status (`PAID` / `PENDING`).
6. Clicks **"Place & Print KOT"**. Order directly enters `CONFIRMED` or `PREPARING` status and KOT is generated.

---

## 6. Order Lifecycle State Machine

- `PLACED`: Customer submitted QR order. Pending cashier/kitchen confirmation.
- `CONFIRMED`: Order accepted by kitchen/counter. KOT generated.
- `PREPARING`: Kitchen actively preparing dishes.
- `READY`: Dishes ready for server pickup or counter collection.
- `DELIVERED`: Order served to customer / handed over at counter.
- `CANCELLED`: Order rejected or cancelled by manager/cashier (requires logging cancellation reason).
