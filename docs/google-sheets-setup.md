# Google Sheets Setup Guide

## Overview

Step-by-step instructions for creating the Calanit database in Google Sheets.

---

## Step 1: Create New Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create new spreadsheet
3. Name it: **Calanit_DB**
4. Share settings: Private (only admin has access)

---

## Step 2: Create Sheets

Rename and create sheets in this order:

1. **Apartments** (rename Sheet1)
2. **Parking_Spaces** (add new sheet)
3. **Availability** (add new sheet)
4. **Bookings** (add new sheet)
5. **Users_Registry** (add new sheet)

*Note: Storage_Rooms sheet not needed for MVP*

---

## Step 3: Setup Apartments Sheet

### Column Headers (Row 1):
```
apartment_number | owner_name_1 | owner_phone_1 | owner_name_2 | owner_phone_2 | owner_name_3 | owner_phone_3 | is_rented | tenant_name_1 | tenant_phone_1 | tenant_name_2 | tenant_phone_2 | lease_start_date | lease_end_date | notes
```

### Sample Data (Rows 2-6):

| apartment_number | owner_name_1 | owner_phone_1 | owner_name_2 | owner_phone_2 | is_rented | tenant_name_1 | tenant_phone_1 | tenant_name_2 | tenant_phone_2 | lease_start_date | lease_end_date |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 | David Cohen | 050-1234567 | Sarah Cohen | 052-9876543 | FALSE | | | | | | |
| 12 | Michael Levi | 054-5551234 | | | TRUE | Yossi Green | 053-7778888 | Rachel Green | 050-9998877 | 2026-01-01 | 2026-12-31 |
| 18 | Ruth Katz | 052-3334444 | | | FALSE | | | | | | |
| 23 | Avi Mizrahi | 050-5556666 | Tamar Mizrahi | 054-7778899 | TRUE | Dan Shapiro | 053-1112233 | | | 2025-06-01 | 2027-05-31 |
| 31 | Eitan Goldberg | 052-4445555 | Maya Goldberg | 050-6667788 | FALSE | | | | | | |

### Data Validation:
- `apartment_number`: Data > Data validation > Number between 1 and 36
- `is_rented`: Data > Data validation > Checkbox
- Phone columns: Custom formula `=REGEXMATCH(B2,"^05[0-9]-[0-9]{7}$")` (adjust cell reference)

### Conditional Formatting:
- Rented apartments: Highlight row if `is_rented = TRUE` (light blue background)

---

## Step 4: Setup Parking_Spaces Sheet

### Column Headers:
```
parking_number | apartment_number | type | current_holder_phone | location_description | status | notes
```

### Sample Data:

| parking_number | apartment_number | type | current_holder_phone | location_description | status |
|---|---|---|---|---|---|
| P-05 | 5 | private | 050-1234567 | Ground floor, section A | active |
| P-12A | 12 | private | 053-7778888 | Ground floor, section B | active |
| P-12B | 12 | private | 050-9998877 | Ground floor, section B | active |
| P-18 | 18 | private | 052-3334444 | Basement level | active |
| P-23 | 23 | private | 053-1112233 | Ground floor, section C | active |
| P-31A | 31 | private | 052-4445555 | Basement level | active |
| P-31B | 31 | private | 050-6667788 | Basement level | active |
| P-C1 | | common | 050-1234567 | Visitor parking, near entrance | active |
| P-C2 | | common | 050-1234567 | Visitor parking, near gate | active |

*Note: Common parking (P-C1, P-C2) managed by admin (David Cohen's phone as placeholder)*

### Data Validation:
- `type`: List: `private, common`
- `status`: List: `active, maintenance, reserved`

### Conditional Formatting:
- Common parking: Highlight if `type = common` (light green)
- Maintenance: Highlight if `status = maintenance` (light red)

---

## Step 5: Setup Availability Sheet

### Column Headers:
```
availability_id | parking_number | owner_phone | available_from | available_to | rental_type | status | created_at | updated_at
```

### Sample Data:

| availability_id | parking_number | owner_phone | available_from | available_to | rental_type | status | created_at | updated_at |
|---|---|---|---|---|---|---|---|---|
| AV-2026-001 | P-05 | 050-1234567 | 2026-04-10T08:00:00 | 2026-04-10T20:00:00 | hourly | available | 2026-04-03T21:00:00 | 2026-04-03T21:00:00 |
| AV-2026-002 | P-18 | 052-3334444 | 2026-04-15T00:00:00 | 2026-04-20T23:59:59 | daily | available | 2026-04-03T21:00:00 | 2026-04-03T21:00:00 |
| AV-2026-003 | P-31B | 050-6667788 | 2026-05-01T00:00:00 | 2026-07-31T23:59:59 | monthly | available | 2026-04-03T21:00:00 | 2026-04-03T21:00:00 |

### Data Validation:
- `rental_type`: List: `hourly, daily, monthly`
- `status`: List: `available, booked, cancelled, expired`

### Date Format:
- All datetime columns: Format > Number > Custom: `yyyy-mm-dd"T"hh:mm:ss`
- Timezone: Jerusalem (GMT+3) - add manually in data: `2026-04-10T08:00:00+03:00` or handle in Apps Script

---

## Step 6: Setup Bookings Sheet

### Column Headers:
```
booking_id | availability_id | parking_number | renter_phone | renter_name | booking_start | booking_end | rental_type | status | created_at | updated_at | cancelled_at | cancellation_reason
```

### Sample Data:

| booking_id | availability_id | parking_number | renter_phone | renter_name | booking_start | booking_end | rental_type | status | created_at | updated_at |
|---|---|---|---|---|---|---|---|---|---|---|
| BK-2026-001 | AV-2026-001 | P-05 | 053-7778888 | Yossi Green | 2026-04-10T10:00:00 | 2026-04-10T14:00:00 | hourly | confirmed | 2026-04-04T15:20:00 | 2026-04-04T15:20:00 |
| BK-2026-002 | AV-2026-002 | P-18 | 050-9998877 | Rachel Green | 2026-04-15T00:00:00 | 2026-04-17T23:59:59 | daily | completed | 2026-04-05T10:30:00 | 2026-04-18T00:05:00 |

### Data Validation:
- `rental_type`: List: `hourly, daily, monthly`
- `status`: List: `pending, confirmed, active, completed, cancelled`

---

## Step 7: Setup Users_Registry Sheet

### Column Headers:
```
phone | full_name | apartment_number | role | is_active | registered_at | last_login
```

### Sample Data:
*This sheet will be auto-populated by Apps Script. Manual setup for testing:*

| phone | full_name | apartment_number | role | is_active | registered_at | last_login |
|---|---|---|---|---|---|---|
| 050-1234567 | David Cohen | 5 | owner | TRUE | 2026-01-01T00:00:00 | |
| 052-9876543 | Sarah Cohen | 5 | owner | TRUE | 2026-01-01T00:00:00 | |
| 054-5551234 | Michael Levi | 12 | owner | TRUE | 2026-01-01T00:00:00 | |
| 053-7778888 | Yossi Green | 12 | tenant | TRUE | 2026-01-01T00:00:00 | |
| 050-9998877 | Rachel Green | 12 | tenant | TRUE | 2026-01-01T00:00:00 | |
| 052-3334444 | Ruth Katz | 18 | owner | TRUE | 2026-01-01T00:00:00 | |
| 050-5556666 | Avi Mizrahi | 23 | owner | TRUE | 2026-01-01T00:00:00 | |
| 054-7778899 | Tamar Mizrahi | 23 | owner | TRUE | 2026-01-01T00:00:00 | |
| 053-1112233 | Dan Shapiro | 23 | tenant | TRUE | 2026-01-01T00:00:00 | |
| 052-4445555 | Eitan Goldberg | 31 | owner | TRUE | 2026-01-01T00:00:00 | |
| 050-6667788 | Maya Goldberg | 31 | owner | TRUE | 2026-01-01T00:00:00 | |

### Data Validation:
- `role`: List: `owner, tenant, admin`
- `is_active`: Checkbox

---

## Step 8: Protect Sheets (Optional)

1. Protect each sheet: Data > Protect sheets and ranges
2. Set permissions: "Only you can edit" (admin only)
3. Warning: "Show a warning when editing this range" for critical columns

---

## Step 9: Get Spreadsheet ID

1. Open spreadsheet
2. Copy URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
3. Extract `{SPREADSHEET_ID}` (long alphanumeric string)
4. Save for Apps Script configuration

---

## Step 10: Create Apps Script Project

1. Extensions > Apps Script
2. Name project: **Calanit_API**
3. See `docs/apps-script-setup.md` for code

---

## Testing Checklist

- [ ] All sheets created with correct names
- [ ] Column headers match specification
- [ ] Sample data entered
- [ ] Phone format validation working
- [ ] Data validation dropdowns working
- [ ] Conditional formatting applied
- [ ] Spreadsheet ID saved
- [ ] Apps Script project created

---

## Maintenance Notes

**Regular admin tasks:**
- Update `Apartments` sheet when leases change
- Update `current_holder_phone` in `Parking_Spaces` when tenants change
- Mark parking as `maintenance` when needed
- Monitor `Bookings` for conflicts

**Automated (via Apps Script):**
- Expire old availability records
- Update booking status (active → completed)
- Sync `Users_Registry` from `Apartments`

---

## Next Steps

After spreadsheet is ready:
1. Create Google Apps Script API (see `apps-script-setup.md`)
2. Deploy as web app
3. Test API endpoints
4. Build frontend interface
