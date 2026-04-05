# Google Sheets Data Model Specification

## Overview

Database structure for Calanit parking management system using Google Sheets.

**Timezone**: All datetime fields use Jerusalem timezone (Asia/Jerusalem)
**Phone Format**: Israeli mobile format `050-1234567` or `+972-50-1234567`
**Date Format**: ISO 8601 with timezone: `2026-04-05T14:00:00+03:00`

---

## Admin-Managed Tables

These tables are filled manually by the administrator.

### Table 1: Parking

Stores information about all parking spaces in the building(s).

| Column | Type | Required | Validation | Description | Example |
|--------|------|----------|------------|-------------|---------|
| parking_number | String | Yes | Unique, format P-XXX | Parking identifier | P-001 |
| type | Enum | Yes | Dropdown list | Parking type (see below) | regular |
| linked_parking_number | String | No | Must exist in Parking | For linked type only | P-002 |
| ownership | Enum | Yes | Dropdown: private, common | Private or common | private |
| street_address | String | Yes | | Building address | HaNassi 15 |
| location_description | String | No | | Physical location details | Ground floor, section A |
| status | Enum | Yes | Dropdown: active, maintenance | Operational status | active |
| notes | String | No | | Additional notes | - |

**Parking Types** (dropdown values):
1. `regular` - Standard parking space (majority)
2. `limited_access` - Harder access (e.g., last in row near wall, harder for large cars)
3. `premium` - Better access, more convenient
4. `disabled` - Expanded space for disabled persons
5. `linked` - Two spaces in tandem (one blocks another's exit)

**Validation Rules**:
- `parking_number`: Unique across all buildings
- `type`: Must be one of 5 types
- `linked_parking_number`: Required if `type = linked`, must reference another parking with `type = linked`
- Linked parking pairs must reference each other (P-001 → P-002, P-002 → P-001)
- `ownership`: Either `private` (belongs to apartment) or `common` (building-owned)
- `status`: Defaults to `active`

**Conditional Formatting**:
- Linked parking: Highlight yellow
- Common parking: Highlight light green
- Maintenance: Highlight light red

---

### Table 2: Owners

Stores information about apartment owners.

| Column | Type | Required | Validation | Description | Example |
|--------|------|----------|------------|-------------|---------|
| owner_id | String | Yes | Auto: OWN-XXX | Unique owner identifier | OWN-001 |
| first_name | String | Yes | | Owner's first name | David |
| family_name | String | Yes | | Owner's family name | Cohen |
| phone | String | Yes | Format validation | Israeli mobile number | 050-1234567 |
| email | String | No | Email format | Email address | david@example.com |
| street_address | String | Yes | | Building address | HaNassi 15 |
| apartment | String | Yes | | Apartment number(s) | 5 or 5,12 |
| storage | String | No | | Storage room number(s) | S-05 or S-05,S-12 |
| parking_spaces | String | No | | Parking number(s) | P-005 or P-005,P-006 |
| is_resident | Boolean | Yes | Checkbox | Lives in the building | TRUE |

**Validation Rules**:
- `phone`: Format `/^(\+972-)?05[0-9]-[0-9]{7}$/` (both formats accepted)
- `phone`: Must be unique across Owners and Tenants tables
- `email`: Optional, standard email validation
- `apartment`: Can be comma-separated list (e.g., "5,12" if owns multiple apartments)
- `storage`: Can be comma-separated list
- `parking_spaces`: Can be comma-separated list
- `is_resident`: TRUE if owner lives in building, FALSE if property is rented out or vacant

**Conditional Formatting**:
- Non-resident owners: Highlight light blue
- Owners with rented-out property: Check Tenants table cross-reference

---

### Table 3: Tenants

Stores information about tenants (apartment/storage/parking renters).

| Column | Type | Required | Validation | Description | Example |
|--------|------|----------|------------|-------------|---------|
| tenant_id | String | Yes | Auto: TEN-XXX | Unique tenant identifier | TEN-001 |
| first_name | String | Yes | | Tenant's first name | Yossi |
| family_name | String | Yes | | Tenant's family name | Green |
| phone | String | Yes | Format validation | Israeli mobile number | 053-7778888 |
| email | String | No | Email format | Email address | yossi@example.com |
| street_address | String | No | | Building address (if renting apartment) | HaNassi 15 |
| apartment | String | No | | Apartment number (if renting) | 12 |
| storage | String | No | | Storage room number (if renting) | S-12 |
| parking_spaces | String | No | | Parking number(s) (if renting) | P-012 |
| rent_from | DateTime | Yes | Must be < rent_until | Lease start date | 2026-01-01T00:00:00+03:00 |
| rent_until | DateTime | Yes | Must be > rent_from | Lease end date | 2026-12-31T23:59:59+03:00 |

**Validation Rules**:
- `phone`: Format `/^(\+972-)?05[0-9]-[0-9]{7}$/`
- `phone`: Must be unique across Owners and Tenants tables
- At least one of `apartment`, `storage`, or `parking_spaces` must be filled
- `parking_spaces`: Can be comma-separated list
- `rent_until` > `rent_from`
- Tenant can rent apartment without parking/storage
- Tenant can rent parking/storage without apartment (non-resident tenant)

**Business Logic**:
- If `apartment` is filled → tenant rents apartment (may also rent parking/storage)
- If only `parking_spaces` or `storage` filled → non-resident tenant (rents only parking/storage)

**Conditional Formatting**:
- Lease expiring soon (< 30 days): Highlight orange
- Expired leases: Highlight red
- Non-resident tenants (no apartment): Highlight light purple

---

### Table 4: Holders (Auto-Generated)

**This table is auto-filled via Google Sheets formulas - admin does not edit manually.**

Consolidated view of current rights holders (who can list parking/storage for subrental).

| Column | Type | Source | Description | Example |
|--------|------|--------|-------------|---------|
| holder_id | String | Auto | Unique identifier | H-001 |
| street_address_apartment | String | Join | `street_address + " - Apt " + apartment` | HaNassi 15 - Apt 12 |
| full_name | String | Join | `first_name + " " + family_name` | Yossi Green |
| holder_type | Enum | Logic | `owner` or `tenant` | tenant |
| phone | String | Copy | Phone number | 053-7778888 |
| storage | String | Copy | Storage room number | S-12 |
| parking_spaces | String | Copy | Parking number(s) | P-012 |

**Formula Logic**:

```
Holder is included if:
1. Owner with is_resident = TRUE (lives there)
2. Owner with is_resident = FALSE AND no tenant rents their property
3. Tenant with valid lease (rent_until >= TODAY)
4. Non-resident tenant (no apartment, but rents parking/storage)

For each holder:
- holder_type = "owner" if from Owners table, "tenant" if from Tenants
- parking_spaces = current parking under their control
- storage = current storage under their control
```

**Google Sheets Formula Examples** (to be placed in Holders sheet):

Cell A2 (holder_id):
```
="H-" & TEXT(ROW()-1, "000")
```

Cell B2 (street_address_apartment):
```
=IF(ISBLANK(Owners!$A2), Tenants!$E2 & " - Apt " & Tenants!$F2, Owners!$E2 & " - Apt " & Owners!$F2)
```

Cell C2 (full_name):
```
=IF(ISBLANK(Owners!$A2), Tenants!$B2 & " " & Tenants!$C2, Owners!$B2 & " " & Owners!$C2)
```

**Note**: Actual formulas will need to be more complex to properly merge and filter data from both tables.

---

## Application Tables

These tables are managed by the application (Google Apps Script).

### Table 5: Availability

Stores parking/storage listings available for subrental.

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| availability_id | String | Yes | Unique ID (UUID or sequential) | AV-2026-0001 |
| resource_type | Enum | Yes | `parking` or `storage` (MVP: parking only) | parking |
| resource_number | String | Yes | Parking/storage number | P-005 |
| owner_phone | String | Yes | Phone of person listing (must be holder) | 050-1234567 |
| available_from | DateTime | Yes | Availability start (ISO 8601) | 2026-04-05T10:00:00+03:00 |
| available_to | DateTime | Yes | Availability end (ISO 8601) | 2026-04-07T18:00:00+03:00 |
| status | Enum | Yes | `available`, `booked`, `cancelled`, `expired` | available |
| created_at | DateTime | Yes | Record creation timestamp | 2026-04-03T21:30:00+03:00 |
| updated_at | DateTime | Yes | Last update timestamp | 2026-04-03T21:30:00+03:00 |

**Validation Rules**:
- `resource_type`: For MVP, must be `parking` (storage support later)
- `resource_number`: Must exist in Parking table with `status = active`
- `owner_phone`: Must match a phone in Holders table with matching resource
- `available_to` > `available_from`
- Duration: Min 1 hour, max 48 hours (48h = 2880 minutes)
- `available_from` must be in future (>= NOW)
- No overlapping availability for same resource (unless status is `cancelled`/`expired`)

**Business Rules**:
- One holder cannot create overlapping availability for same parking
- When booking is created, linked availability changes `status` to `booked`
- Availability auto-expires when `available_to` < NOW()

**Indexes** (for Apps Script optimization):
- `resource_number` + `status`
- `available_from` + `available_to` (range queries)
- `owner_phone`

---

### Table 6: Bookings

Stores actual parking/storage reservations.

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| booking_id | String | Yes | Unique ID (UUID) | BK-2026-0001 |
| availability_id | String | Yes | Reference to Availability | AV-2026-0001 |
| resource_type | Enum | Yes | `parking` or `storage` | parking |
| resource_number | String | Yes | Denormalized for quick lookup | P-005 |
| renter_phone | String | Yes | Phone of person booking | 053-7778888 |
| renter_name | String | No | Name (from Holders) | Yossi Green |
| booking_start | DateTime | Yes | Booking start (hourly slots) | 2026-04-05T14:00:00+03:00 |
| booking_end | DateTime | Yes | Booking end (hourly slots) | 2026-04-05T18:00:00+03:00 |
| status | Enum | Yes | `pending`, `confirmed`, `active`, `completed`, `cancelled` | confirmed |
| created_at | DateTime | Yes | Booking creation timestamp | 2026-04-04T15:20:00+03:00 |
| updated_at | DateTime | Yes | Last update timestamp | 2026-04-04T15:20:00+03:00 |
| cancelled_at | DateTime | No | Cancellation timestamp | - |
| cancellation_reason | String | No | Why booking was cancelled | - |

**Validation Rules**:
- `availability_id`: Must exist in Availability table
- `resource_number`: Must match availability record
- `renter_phone`: Must exist in Holders table
- `renter_phone` ≠ `owner_phone` (can't book your own parking)
- `booking_start` >= `available_from` (from availability)
- `booking_end` <= `available_to` (from availability)
- Duration: Min 1 hour, max 48 hours
- Hourly slots: booking times must be at exact hour marks (e.g., 14:00, 15:00, not 14:30)
- No overlapping bookings for same resource (unless status is `cancelled`)

**Conflict Resolution Rules**:
- Auto-block overlapping bookings for same parking
- One person cannot book more than 2 parking spaces simultaneously (across all active bookings)
- Linked parking pairs must be booked together (can't book just one)

**Status Flow**:
1. `pending` - just created, waiting confirmation (auto-confirm for MVP)
2. `confirmed` - booking accepted
3. `active` - booking period started (`booking_start` <= NOW < `booking_end`)
4. `completed` - booking period ended (`booking_end` < NOW)
5. `cancelled` - booking cancelled by user or admin

**Indexes**:
- `renter_phone` + `status` (user's active bookings)
- `resource_number` + `booking_start` + `booking_end` (conflict detection)
- `availability_id`

---

### Table 7: Users_Registry

Phone number registry for authentication (auto-generated from Owners/Tenants).

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| phone | String | Yes | User phone (primary key) | 050-1234567 |
| full_name | String | Yes | Full name | David Cohen |
| street_address | String | No | Building address | HaNassi 15 |
| apartment | String | No | Apartment (if owner/tenant) | 5 |
| role | Enum | Yes | `owner`, `tenant`, `admin` | owner |
| is_active | Boolean | Yes | Account active status | TRUE |
| registered_at | DateTime | Yes | Registration timestamp | 2026-01-01T00:00:00+03:00 |
| last_login | DateTime | No | Last successful login | 2026-04-03T21:30:00+03:00 |

**Auto-Population Logic**:
- Sync from Owners table: all owners added with `role = owner`
- Sync from Tenants table: all tenants with valid lease added with `role = tenant`
- Admin manually sets `role = admin` for building manager(s)
- `is_active = FALSE` blocks login

**Validation Rules**:
- `phone`: Unique, must exist in Owners or Tenants
- `role`: Defaults to `owner` or `tenant`, manually set to `admin`
- Expired tenants automatically set `is_active = FALSE`

---

## Data Maintenance & Automation

### Auto-Updates (Google Apps Script Time-Driven Triggers)

Run daily at 00:05 AM Jerusalem time:

1. **Expire old availability**:
   ```
   UPDATE Availability 
   SET status = 'expired' 
   WHERE available_to < NOW() AND status = 'available'
   ```

2. **Update booking status to active**:
   ```
   UPDATE Bookings 
   SET status = 'active' 
   WHERE booking_start <= NOW() AND booking_end > NOW() AND status = 'confirmed'
   ```

3. **Complete finished bookings**:
   ```
   UPDATE Bookings 
   SET status = 'completed' 
   WHERE booking_end < NOW() AND status IN ('active', 'confirmed')
   ```

4. **Sync Users_Registry**:
   ```
   - Add new owners/tenants
   - Deactivate expired tenants
   - Update names/apartments if changed
   ```

5. **Regenerate Holders table**:
   ```
   - Recalculate from Owners + Tenants
   - Apply residency rules
   - Update parking/storage assignments
   ```

### Manual Admin Tasks

- Update Owners table when ownership changes
- Update Tenants table when new lease starts/ends
- Update Parking table when parking status changes (maintenance, etc.)
- Manually resolve booking conflicts if system auto-blocking fails
- Set `role = admin` in Users_Registry for building managers

---

## Sample Data Requirements

Template should include realistic test data:

### Buildings
- 2 buildings: "HaNassi 15" and "HaNassi 17"
- HaNassi 15: 20 apartments
- HaNassi 17: 16 apartments
- Total: 36 apartments

### Parking Spaces
- 40 total parking spaces across both buildings
- Type breakdown:
  - 28 regular (70%)
  - 4 limited_access (10%)
  - 4 premium (10%)
  - 2 disabled (5%)
  - 2 linked pairs = 4 spaces (10%)
- Ownership:
  - 36 private (1 per apartment average)
  - 4 common (building-owned visitor parking)

### Owners
- 36 apartments with owners
- Mix of single owners and co-owners (couples)
- 80% resident owners (live in building)
- 20% non-resident owners (rented out or vacant)

### Tenants
- 10 apartments rented (6 in HaNassi 15, 4 in HaNassi 17)
- Mix of single tenants and couples
- 2 non-resident tenants (rent only parking, no apartment)
- Lease periods: some expiring soon, some long-term

### Availability
- 5 listings: mix of short-term (few hours), medium (1-2 days), near-limit (48h)
- Different parking types listed
- Different buildings

### Bookings
- 4 bookings in different statuses:
  - 1 confirmed (future)
  - 1 active (ongoing)
  - 1 completed (past)
  - 1 cancelled
- Show conflict scenarios in comments/notes

---

## Google Sheets Formulas for Holders Table

**Detailed formula logic for auto-generating Holders table:**

### Step 1: Create Helper Columns in Owners/Tenants

**Owners sheet** - Add column `is_holder`:
```
=IF(AND(I2=TRUE), TRUE, IF(COUNTIFS(Tenants!$E:$E, E2, Tenants!$F:$F, F2, Tenants!$J:$J, ">="&TODAY())=0, TRUE, FALSE))
```
Logic: Owner is holder if resident OR if non-resident with no active tenant

**Tenants sheet** - Add column `is_holder`:
```
=IF(J2>=TODAY(), TRUE, FALSE)
```
Logic: Tenant is holder if lease is still active

### Step 2: Holders Table Formulas

Use `QUERY` function to merge and filter:

```
=QUERY({
  Owners!A2:J, "owner", Owners!K2:K;
  Tenants!A2:K, "tenant", Tenants!L2:L
}, 
"SELECT Col11, Col5, Col6, Col2, Col3, Col4, Col7, Col8, Col12 
WHERE Col13 = TRUE", 0)
```

**Note**: Exact column references will depend on final table structure. This is a conceptual example.

---

## Next Steps

1. Create Google Sheets template with all tables
2. Implement data validation dropdowns
3. Add conditional formatting rules
4. Write Google Apps Script for auto-updates
5. Create sample data for testing
6. Document API endpoints (separate file)
