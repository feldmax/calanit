# Google Sheets Data Model Specification

## Overview

Database structure for Calanit parking management system using Google Sheets.

**Timezone**: All datetime fields use Jerusalem timezone (Asia/Jerusalem)
**Phone Format**: Israeli mobile format `050-1234567` (10 digits, dash after 3-digit prefix)

---

## Sheet 1: Apartments

Stores information about apartment owners and current tenants.

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| apartment_number | Number | Yes | Unique apartment identifier (1-36) | 12 |
| owner_name_1 | String | Yes | First owner full name | David Cohen |
| owner_phone_1 | String | Yes | First owner phone (format: 050-1234567) | 050-1234567 |
| owner_name_2 | String | No | Second owner full name | Sarah Cohen |
| owner_phone_2 | String | No | Second owner phone | 052-9876543 |
| owner_name_3 | String | No | Third owner full name (rare cases) | - |
| owner_phone_3 | String | No | Third owner phone | - |
| is_rented | Boolean | Yes | TRUE if apartment is currently rented | TRUE |
| tenant_name_1 | String | No | First tenant full name | Yossi Levi |
| tenant_phone_1 | String | No | First tenant phone | 054-5551234 |
| tenant_name_2 | String | No | Second tenant full name | Rachel Levi |
| tenant_phone_2 | String | No | Second tenant phone | 053-5554321 |
| lease_start_date | Date | No | Lease start date (if rented) | 2026-01-01 |
| lease_end_date | Date | No | Lease end date (if rented) | 2026-12-31 |
| notes | String | No | Additional notes | - |

**Validation Rules**:
- `apartment_number`: 1-36, unique
- Phone format: `/^05[0-9]-[0-9]{7}$/`
- If `is_rented = TRUE`, at least `tenant_name_1` and `tenant_phone_1` required
- `lease_end_date` must be after `lease_start_date`

---

## Sheet 2: Parking_Spaces

Stores parking space assignments.

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| parking_number | String | Yes | Unique parking identifier | P-15 |
| apartment_number | Number | No | Owner apartment (NULL for common spaces) | 12 |
| type | Enum | Yes | `private` or `common` | private |
| current_holder_phone | String | Yes | Phone of current rights holder (owner or tenant) | 054-5551234 |
| location_description | String | No | Physical location description | Ground floor, near elevator |
| status | Enum | Yes | `active`, `maintenance`, `reserved` | active |
| notes | String | No | Additional notes | - |

**Validation Rules**:
- `parking_number`: Unique, format `P-XX` (e.g., P-01, P-42)
- `type`: Must be `private` or `common`
- If `type = common`, `apartment_number` must be NULL
- If `type = private`, `apartment_number` required (1-36)
- `current_holder_phone`: Must exist in Apartments sheet (owner or tenant)
- `status`: Default `active`

**Business Logic**:
- When apartment is rented, `current_holder_phone` = tenant phone
- When apartment is owner-occupied, `current_holder_phone` = owner phone
- Admin must update `current_holder_phone` when lease status changes

---

## Sheet 3: Storage_Rooms

**Note**: Storage rooms out of scope for MVP. Structure defined for future.

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| storage_number | String | Yes | Unique storage identifier (S-01 to S-36) |
| apartment_number | Number | Yes | Owner apartment (1-36) |
| current_holder_phone | String | Yes | Current rights holder phone |
| status | Enum | Yes | `active`, `maintenance` |

---

## Sheet 4: Availability

Stores parking spaces listed as available for subrental.

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| availability_id | String | Yes | Unique identifier (UUID or auto-generated) | AV-2026-001 |
| parking_number | String | Yes | Reference to Parking_Spaces | P-15 |
| owner_phone | String | Yes | Phone of person listing (must be current holder) | 054-5551234 |
| available_from | DateTime | Yes | Start of availability (ISO 8601) | 2026-04-05T10:00:00+03:00 |
| available_to | DateTime | Yes | End of availability (ISO 8601) | 2026-04-07T18:00:00+03:00 |
| rental_type | Enum | Yes | `hourly`, `daily`, `monthly` | daily |
| status | Enum | Yes | `available`, `booked`, `cancelled`, `expired` | available |
| created_at | DateTime | Yes | Record creation timestamp | 2026-04-03T21:30:00+03:00 |
| updated_at | DateTime | Yes | Last update timestamp | 2026-04-03T21:30:00+03:00 |

**Validation Rules**:
- `parking_number`: Must exist in Parking_Spaces sheet
- `owner_phone`: Must match `current_holder_phone` in Parking_Spaces
- `available_to` > `available_from`
- Duration limits by rental_type:
  - `hourly`: 1 hour min, 24 hours max
  - `daily`: 1 day min, 31 days max
  - `monthly`: 1 month min, 12 months max
- `status`: Defaults to `available`
- No overlapping availability records for same parking (unless status is `cancelled`/`expired`)

**Indexes** (Apps Script optimization):
- `parking_number` + `status`
- `available_from` + `available_to` (range queries)

---

## Sheet 5: Bookings

Stores actual parking reservations.

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| booking_id | String | Yes | Unique identifier (UUID) | BK-2026-001 |
| availability_id | String | Yes | Reference to Availability | AV-2026-001 |
| parking_number | String | Yes | Denormalized for quick lookup | P-15 |
| renter_phone | String | Yes | Phone of person booking | 050-9998877 |
| renter_name | String | No | Name of renter (from Apartments) | Michael Green |
| booking_start | DateTime | Yes | Booking start time | 2026-04-05T14:00:00+03:00 |
| booking_end | DateTime | Yes | Booking end time | 2026-04-06T10:00:00+03:00 |
| rental_type | Enum | Yes | Copied from Availability | daily |
| status | Enum | Yes | `pending`, `confirmed`, `active`, `completed`, `cancelled` | confirmed |
| created_at | DateTime | Yes | Booking creation timestamp | 2026-04-04T15:20:00+03:00 |
| updated_at | DateTime | Yes | Last update timestamp | 2026-04-04T15:20:00+03:00 |
| cancelled_at | DateTime | No | Cancellation timestamp | - |
| cancellation_reason | String | No | Why booking was cancelled | - |

**Validation Rules**:
- `availability_id`: Must exist in Availability sheet
- `parking_number`: Must match availability record
- `renter_phone`: Must exist in Apartments sheet (owner or tenant)
- `renter_phone` ≠ `owner_phone` from availability (can't book your own parking)
- `booking_start` >= `available_from`
- `booking_end` <= `available_to`
- No overlapping bookings for same parking (unless status is `cancelled`)

**Status Flow**:
1. `pending` - just created, waiting confirmation
2. `confirmed` - accepted by owner (auto-confirm for MVP)
3. `active` - booking period started
4. `completed` - booking period ended
5. `cancelled` - booking cancelled by user

**Indexes**:
- `renter_phone` + `status` (user's bookings)
- `parking_number` + `booking_start` + `booking_end` (conflict detection)
- `availability_id` (lookup)

---

## Sheet 6: Users_Registry

Phone number registry for authentication.

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| phone | String | Yes | User phone (primary key) | 050-1234567 |
| full_name | String | Yes | Full name | David Cohen |
| apartment_number | Number | No | Apartment (if owner/tenant) | 12 |
| role | Enum | Yes | `owner`, `tenant`, `admin` | owner |
| is_active | Boolean | Yes | Account active status | TRUE |
| registered_at | DateTime | Yes | Registration timestamp | 2026-01-01T00:00:00+03:00 |
| last_login | DateTime | No | Last successful login | 2026-04-03T21:30:00+03:00 |

**Note**: This sheet is auto-populated from Apartments sheet. Admin doesn't edit manually.

**Validation Rules**:
- `phone`: Unique, Israeli format
- `role`: `admin` for building manager, `owner` or `tenant` for residents
- `is_active`: FALSE blocks login

---

## Sample Data Requirements

Template should include:
- 5 sample apartments (2 rented, 3 owner-occupied)
- 10 sample parking spaces (8 private, 2 common)
- 3 sample availability records (different rental types)
- 2 sample bookings (1 confirmed, 1 completed)
- Realistic Israeli names and phone numbers (fake data)

---

## Data Maintenance

**Auto-updates needed** (via Google Apps Script triggers):
1. Update `Availability.status` to `expired` when `available_to` < NOW()
2. Update `Bookings.status` to `active` when `booking_start` <= NOW()
3. Update `Bookings.status` to `completed` when `booking_end` < NOW()
4. Sync `Users_Registry` from `Apartments` sheet daily

**Manual admin tasks**:
- Update `current_holder_phone` when lease changes
- Mark parking as `maintenance` when needed
- Handle booking conflicts manually (MVP)

---

## Google Apps Script API Endpoints (planned)

1. `POST /auth` - Verify phone number
2. `GET /parking/available` - List available parking (with filters)
3. `POST /booking` - Create new booking
4. `GET /booking/my` - User's bookings
5. `POST /availability` - List parking as available
6. `DELETE /booking/:id` - Cancel booking

Detailed API spec in `api-spec.md`.
