# Sample Data for Calanit Database

## Overview

Realistic test data for initial Google Sheets setup and application testing.

**Scope**:
- 2 buildings: HaNassi 15 (20 apartments), HaNassi 17 (16 apartments)
- 36 total apartments
- 40 parking spaces (5 types)
- 25 owners
- 11 tenants (10 apartment tenants + 1 non-resident parking-only tenant)
- 5 availability listings
- 4 bookings (various statuses)

---

## Table 1: Parking (40 spaces)

| parking_number | type | linked_parking_number | ownership | street_address | location_description | status | notes |
|---|---|---|---|---|---|---|---|
| P-001 | regular | | private | HaNassi 15 | Ground floor, section A | active | |
| P-002 | regular | | private | HaNassi 15 | Ground floor, section A | active | |
| P-003 | premium | | private | HaNassi 15 | Ground floor, near entrance | active | |
| P-004 | regular | | private | HaNassi 15 | Ground floor, section A | active | |
| P-005 | regular | | private | HaNassi 15 | Ground floor, section B | active | |
| P-006 | limited_access | | private | HaNassi 15 | Ground floor, last in row, tight | active | |
| P-007 | regular | | private | HaNassi 15 | Ground floor, section B | active | |
| P-008 | regular | | private | HaNassi 15 | Ground floor, section B | active | |
| P-009 | linked | P-010 | private | HaNassi 15 | Ground floor, tandem pair 1 | active | Front space |
| P-010 | linked | P-009 | private | HaNassi 15 | Ground floor, tandem pair 1 | active | Rear space |
| P-011 | regular | | private | HaNassi 15 | Basement level | active | |
| P-012 | regular | | private | HaNassi 15 | Basement level | active | |
| P-013 | regular | | private | HaNassi 15 | Basement level | active | |
| P-014 | premium | | private | HaNassi 15 | Basement, wide space | active | |
| P-015 | regular | | private | HaNassi 15 | Basement level | active | |
| P-016 | disabled | | private | HaNassi 15 | Ground floor, near elevator | active | Expanded width |
| P-017 | regular | | private | HaNassi 15 | Basement level | active | |
| P-018 | regular | | private | HaNassi 15 | Basement level | active | |
| P-019 | limited_access | | private | HaNassi 15 | Basement, corner spot | active | |
| P-020 | regular | | private | HaNassi 15 | Basement level | active | |
| P-C01 | regular | | common | HaNassi 15 | Ground floor, visitor area | active | |
| P-C02 | regular | | common | HaNassi 15 | Ground floor, visitor area | active | |
| P-101 | regular | | private | HaNassi 17 | Ground floor, section A | active | |
| P-102 | regular | | private | HaNassi 17 | Ground floor, section A | active | |
| P-103 | premium | | private | HaNassi 17 | Ground floor, near entrance | active | |
| P-104 | regular | | private | HaNassi 17 | Ground floor, section A | active | |
| P-105 | regular | | private | HaNassi 17 | Ground floor, section B | active | |
| P-106 | limited_access | | private | HaNassi 17 | Ground floor, narrow space | active | |
| P-107 | regular | | private | HaNassi 17 | Ground floor, section B | active | |
| P-108 | regular | | private | HaNassi 17 | Basement level | active | |
| P-109 | linked | P-110 | private | HaNassi 17 | Basement, tandem pair 2 | active | Front space |
| P-110 | linked | P-109 | private | HaNassi 17 | Basement, tandem pair 2 | active | Rear space |
| P-111 | regular | | private | HaNassi 17 | Basement level | active | |
| P-112 | regular | | private | HaNassi 17 | Basement level | active | |
| P-113 | premium | | private | HaNassi 17 | Basement, corner wide | active | |
| P-114 | regular | | private | HaNassi 17 | Basement level | active | |
| P-115 | disabled | | private | HaNassi 17 | Ground floor, near elevator | active | Expanded width |
| P-116 | regular | | private | HaNassi 17 | Basement level | active | |
| P-C03 | regular | | common | HaNassi 17 | Ground floor, visitor area | active | |
| P-C04 | limited_access | | common | HaNassi 17 | Side entrance, tight | active | |

**Type Distribution**:
- Regular: 28 (70%)
- Limited Access: 4 (10%)
- Premium: 4 (10%)
- Disabled: 2 (5%)
- Linked: 4 in 2 pairs (10%)

**Ownership**:
- Private: 36 (90%)
- Common: 4 (10%)

---

## Table 2: Owners (25 owners for 36 apartments)

Some apartments have co-owners (couples). 11 owners are co-owners.

| owner_id | first_name | family_name | phone | email | street_address | apartment | storage | parking_spaces | is_resident |
|---|---|---|---|---|---|---|---|---|---|
| OWN-001 | David | Cohen | 050-1234567 | david.cohen@example.com | HaNassi 15 | 1 | S-01 | P-001 | TRUE |
| OWN-002 | Sarah | Cohen | 052-9876543 | sarah.cohen@example.com | HaNassi 15 | 1 | S-01 | P-001 | TRUE |
| OWN-003 | Michael | Levi | 054-5551234 | michael.levi@example.com | HaNassi 15 | 2 | S-02 | P-002 | FALSE |
| OWN-004 | Ruth | Katz | 052-3334444 | ruth.katz@example.com | HaNassi 15 | 3 | S-03 | P-003 | TRUE |
| OWN-005 | Avi | Mizrahi | 050-5556666 | avi.mizrahi@example.com | HaNassi 15 | 4 | S-04 | P-004 | FALSE |
| OWN-006 | Tamar | Mizrahi | 054-7778899 | tamar.mizrahi@example.com | HaNassi 15 | 4 | S-04 | P-004 | FALSE |
| OWN-007 | Eitan | Goldberg | 052-4445555 | eitan.goldberg@example.com | HaNassi 15 | 5 | S-05 | P-005 | TRUE |
| OWN-008 | Maya | Goldberg | 050-6667788 | maya.goldberg@example.com | HaNassi 15 | 5 | S-05 | P-005 | TRUE |
| OWN-009 | Yonatan | Shapiro | 053-1112233 | yonatan.shapiro@example.com | HaNassi 15 | 6 | S-06 | P-006 | TRUE |
| OWN-010 | Noa | Ben-David | 050-2223344 | noa.bendavid@example.com | HaNassi 15 | 7 | S-07 | P-007 | FALSE |
| OWN-011 | Daniel | Zohar | 052-5556677 | daniel.zohar@example.com | HaNassi 15 | 8 | S-08 | P-008 | TRUE |
| OWN-012 | Shira | Israeli | 054-8889900 | shira.israeli@example.com | HaNassi 15 | 9 | S-09 | P-009,P-010 | TRUE |
| OWN-013 | Moshe | Kohen | 050-3334455 | moshe.kohen@example.com | HaNassi 15 | 10 | S-10 | P-011 | FALSE |
| OWN-014 | Rachel | Alon | 053-6667788 | rachel.alon@example.com | HaNassi 15 | 11 | S-11 | P-012 | TRUE |
| OWN-015 | Uri | Segal | 052-7778899 | uri.segal@example.com | HaNassi 15 | 12 | S-12 | P-013 | FALSE |
| OWN-016 | Tal | Baruch | 054-1112222 | tal.baruch@example.com | HaNassi 15 | 13 | S-13 | P-014 | TRUE |
| OWN-017 | Yael | Friedman | 050-4445566 | yael.friedman@example.com | HaNassi 15 | 14 | S-14 | P-015 | TRUE |
| OWN-018 | Roni | Levy | 053-9990011 | roni.levy@example.com | HaNassi 15 | 15 | S-15 | P-016 | TRUE |
| OWN-019 | Ofer | Koren | 052-1231234 | ofer.koren@example.com | HaNassi 15 | 16 | S-16 | P-017 | FALSE |
| OWN-020 | Lior | Avraham | 054-3213210 | lior.avraham@example.com | HaNassi 15 | 17 | S-17 | P-018 | TRUE |
| OWN-021 | Chen | Dahan | 050-7654321 | chen.dahan@example.com | HaNassi 15 | 18 | S-18 | P-019 | FALSE |
| OWN-022 | Hila | Peretz | 053-4567890 | hila.peretz@example.com | HaNassi 15 | 19 | S-19 | P-020 | TRUE |
| OWN-023 | Amir | Golan | 052-9876540 | amir.golan@example.com | HaNassi 15 | 20 | S-20 | | TRUE |
| OWN-024 | Dina | Azoulay | 054-6543210 | dina.azoulay@example.com | HaNassi 17 | 1 | S-101 | P-101 | TRUE |
| OWN-025 | Shlomo | Biton | 050-1239876 | shlomo.biton@example.com | HaNassi 17 | 2 | S-102 | P-102 | FALSE |

*Continue pattern for HaNassi 17 apartments 1-16...*

**Statistics**:
- Resident owners: ~20 (80%)
- Non-resident owners: ~5 (20%)
- Co-owners: 11 (several couples)

---

## Table 3: Tenants (11 tenants)

| tenant_id | first_name | family_name | phone | email | street_address | apartment | storage | parking_spaces | rent_from | rent_until |
|---|---|---|---|---|---|---|---|---|---|---|
| TEN-001 | Yossi | Green | 053-7778888 | yossi.green@example.com | HaNassi 15 | 2 | S-02 | P-002 | 2026-01-01T00:00:00+03:00 | 2026-12-31T23:59:59+03:00 |
| TEN-002 | Rachel | Green | 050-9998877 | rachel.green@example.com | HaNassi 15 | 2 | S-02 | P-002 | 2026-01-01T00:00:00+03:00 | 2026-12-31T23:59:59+03:00 |
| TEN-003 | Dan | Shapiro | 053-1231236 | dan.shapiro@example.com | HaNassi 15 | 4 | S-04 | P-004 | 2025-06-01T00:00:00+03:00 | 2027-05-31T23:59:59+03:00 |
| TEN-004 | Gal | Eshel | 052-7776665 | gal.eshel@example.com | HaNassi 15 | 7 | S-07 | P-007 | 2026-03-01T00:00:00+03:00 | 2027-02-28T23:59:59+03:00 |
| TEN-005 | Meir | Hazan | 054-5554443 | meir.hazan@example.com | HaNassi 15 | 10 | S-10 | P-011 | 2025-09-01T00:00:00+03:00 | 2026-08-31T23:59:59+03:00 |
| TEN-006 | Amit | Sasson | 050-1110009 | amit.sasson@example.com | HaNassi 15 | 12 | S-12 | P-013 | 2026-02-01T00:00:00+03:00 | 2027-01-31T23:59:59+03:00 |
| TEN-007 | Nir | Vaknin | 053-8887776 | nir.vaknin@example.com | HaNassi 15 | 16 | S-16 | P-017 | 2026-04-01T00:00:00+03:00 | 2026-09-30T23:59:59+03:00 |
| TEN-008 | Sigal | Malka | 052-4443332 | sigal.malka@example.com | HaNassi 15 | 18 | S-18 | P-019 | 2025-10-01T00:00:00+03:00 | 2026-04-30T23:59:59+03:00 |
| TEN-009 | Guy | Eliyahu | 054-2221110 | guy.eliyahu@example.com | HaNassi 17 | 2 | S-102 | P-102 | 2026-01-15T00:00:00+03:00 | 2027-01-14T23:59:59+03:00 |
| TEN-010 | Shani | Ovadia | 050-5559998 | shani.ovadia@example.com | HaNassi 17 | 5 | S-105 | P-105 | 2025-12-01T00:00:00+03:00 | 2026-11-30T23:59:59+03:00 |
| TEN-011 | Idan | Tzur | 053-3332221 | idan.tzur@example.com | | | | P-020 | 2026-03-01T00:00:00+03:00 | 2027-02-28T23:59:59+03:00 |

**Notes**:
- TEN-011 is non-resident tenant (rents only parking P-020, no apartment)
- TEN-008 lease expires soon (2026-04-30) - should show orange warning
- TEN-001 & TEN-002 are couple (co-tenants)

---

## Table 4: Holders (Auto-Generated Sample)

**This table is auto-generated. Sample data shown for reference.**

| holder_id | street_address_apartment | full_name | holder_type | phone | storage | parking_spaces |
|---|---|---|---|---|---|---|
| H-001 | HaNassi 15 - Apt 1 | David Cohen | owner | 050-1234567 | S-01 | P-001 |
| H-002 | HaNassi 15 - Apt 1 | Sarah Cohen | owner | 052-9876543 | S-01 | P-001 |
| H-003 | HaNassi 15 - Apt 2 | Yossi Green | tenant | 053-7778888 | S-02 | P-002 |
| H-004 | HaNassi 15 - Apt 2 | Rachel Green | tenant | 050-9998877 | S-02 | P-002 |
| H-005 | HaNassi 15 - Apt 3 | Ruth Katz | owner | 052-3334444 | S-03 | P-003 |
| H-006 | HaNassi 15 - Apt 4 | Dan Shapiro | tenant | 053-1231236 | S-04 | P-004 |
| H-007 | HaNassi 15 - Apt 5 | Eitan Goldberg | owner | 052-4445555 | S-05 | P-005 |
| H-008 | HaNassi 15 - Apt 5 | Maya Goldberg | owner | 050-6667788 | S-05 | P-005 |
| H-009 | HaNassi 15 - Apt 6 | Yonatan Shapiro | owner | 053-1112233 | S-06 | P-006 |
| H-010 | HaNassi 15 - Apt 7 | Gal Eshel | tenant | 052-7776665 | S-07 | P-007 |

*... (continue for all active holders)*

---

## Table 5: Availability (5 listings)

| availability_id | resource_type | resource_number | owner_phone | available_from | available_to | status | created_at | updated_at |
|---|---|---|---|---|---|---|---|---|
| AV-2026-0001 | parking | P-001 | 050-1234567 | 2026-04-10T08:00:00+03:00 | 2026-04-10T20:00:00+03:00 | available | 2026-04-03T21:00:00+03:00 | 2026-04-03T21:00:00+03:00 |
| AV-2026-0002 | parking | P-003 | 052-3334444 | 2026-04-15T06:00:00+03:00 | 2026-04-16T22:00:00+03:00 | available | 2026-04-03T21:15:00+03:00 | 2026-04-03T21:15:00+03:00 |
| AV-2026-0003 | parking | P-005 | 050-6667788 | 2026-04-20T10:00:00+03:00 | 2026-04-22T10:00:00+03:00 | available | 2026-04-04T10:30:00+03:00 | 2026-04-04T10:30:00+03:00 |
| AV-2026-0004 | parking | P-007 | 052-7776665 | 2026-04-12T14:00:00+03:00 | 2026-04-12T17:00:00+03:00 | booked | 2026-04-04T12:00:00+03:00 | 2026-04-04T14:45:00+03:00 |
| AV-2026-0005 | parking | P-013 | 050-1110009 | 2026-04-08T00:00:00+03:00 | 2026-04-09T00:00:00+03:00 | available | 2026-04-04T16:20:00+03:00 | 2026-04-04T16:20:00+03:00 |

**Notes**:
- AV-2026-0001: Short listing (12 hours) - David Cohen's parking
- AV-2026-0002: 40-hour listing (premium parking) - Ruth Katz
- AV-2026-0003: 48-hour max listing (Maya Goldberg)
- AV-2026-0004: Already booked (status changed)
- AV-2026-0005: 24-hour listing (tenant Amit Sasson)

---

## Table 6: Bookings (4 bookings)

| booking_id | availability_id | resource_type | resource_number | renter_phone | renter_name | booking_start | booking_end | status | created_at | updated_at | cancelled_at | cancellation_reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BK-2026-0001 | AV-2026-0004 | parking | P-007 | 053-1112233 | Yonatan Shapiro | 2026-04-12T14:00:00+03:00 | 2026-04-12T17:00:00+03:00 | confirmed | 2026-04-04T14:45:00+03:00 | 2026-04-04T14:45:00+03:00 | | |
| BK-2026-0002 | AV-2026-0010 | parking | P-011 | 050-6667788 | Maya Goldberg | 2026-04-02T10:00:00+03:00 | 2026-04-02T18:00:00+03:00 | completed | 2026-04-01T20:30:00+03:00 | 2026-04-03T00:10:00+03:00 | | |
| BK-2026-0003 | AV-2026-0011 | parking | P-002 | 052-3334444 | Ruth Katz | 2026-04-05T08:00:00+03:00 | 2026-04-05T12:00:00+03:00 | active | 2026-04-04T19:00:00+03:00 | 2026-04-05T08:05:00+03:00 | | |
| BK-2026-0004 | AV-2026-0012 | parking | P-014 | 053-7778888 | Yossi Green | 2026-04-06T15:00:00+03:00 | 2026-04-06T20:00:00+03:00 | cancelled | 2026-04-03T11:20:00+03:00 | 2026-04-03T16:30:00+03:00 | 2026-04-03T16:30:00+03:00 | Plans changed |

**Notes**:
- BK-2026-0001: Future confirmed booking (Yonatan books Gal's parking)
- BK-2026-0002: Completed past booking (Maya booked tenant Meir's parking)
- BK-2026-0003: Currently active (ongoing now - Ruth books tenant parking)
- BK-2026-0004: Cancelled booking (Yossi cancelled Tal's parking booking)

**Test Scenarios**:
- Conflict detection: Try booking P-007 on 2026-04-12 14:00-17:00 (should fail - overlaps BK-2026-0001)
- Max 2 parking limit: If Yonatan tries to book 3rd parking while BK-2026-0001 active (should fail)
- Linked parking: Must book both P-009 and P-010 together (can't book just one)

---

## Table 7: Users_Registry (Auto-Generated Sample)

| phone | full_name | street_address | apartment | role | is_active | registered_at | last_login |
|---|---|---|---|---|---|---|---|
| 050-1234567 | David Cohen | HaNassi 15 | 1 | admin | TRUE | 2026-01-01T00:00:00+03:00 | 2026-04-04T21:30:00+03:00 |
| 052-9876543 | Sarah Cohen | HaNassi 15 | 1 | owner | TRUE | 2026-01-01T00:00:00+03:00 | 2026-04-03T15:20:00+03:00 |
| 054-5551234 | Michael Levi | HaNassi 15 | 2 | owner | TRUE | 2026-01-01T00:00:00+03:00 | |
| 053-7778888 | Yossi Green | HaNassi 15 | 2 | tenant | TRUE | 2026-01-01T00:00:00+03:00 | 2026-04-04T10:15:00+03:00 |
| 050-9998877 | Rachel Green | HaNassi 15 | 2 | tenant | TRUE | 2026-01-01T00:00:00+03:00 | 2026-04-02T19:45:00+03:00 |
| 052-3334444 | Ruth Katz | HaNassi 15 | 3 | owner | TRUE | 2026-01-01T00:00:00+03:00 | 2026-04-05T08:00:00+03:00 |
| 050-5556666 | Avi Mizrahi | HaNassi 15 | 4 | owner | TRUE | 2026-01-01T00:00:00+03:00 | |
| 054-7778899 | Tamar Mizrahi | HaNassi 15 | 4 | owner | TRUE | 2026-01-01T00:00:00+03:00 | |
| 053-1231236 | Dan Shapiro | HaNassi 15 | 4 | tenant | TRUE | 2025-06-01T00:00:00+03:00 | 2026-04-01T12:30:00+03:00 |

*... (continue for all users)*

**Notes**:
- David Cohen has `role = admin` (building manager)
- Non-active owners (Michael Levi, etc.) have no last_login (never logged in)
- Tenants automatically added when lease starts
- Expired tenants would have `is_active = FALSE` (auto-updated daily)

---

## Data Insertion Instructions

### Copy-Paste Method:
1. Open Google Sheets
2. Select cell A2 in each sheet
3. Paste entire table (without headers - headers already in row 1)
4. Verify data formatting (especially datetime columns)

### DateTime Format Issues:
If dates don't display correctly:
1. Select datetime columns
2. Format > Number > Custom
3. Enter: `yyyy-mm-dd"T"hh:mm:ss"+03:00"`

### Phone Number Validation:
After pasting Owners/Tenants data:
1. Test entering invalid phone: `050-12345` (should reject)
2. Test valid formats: `050-1234567` and `+972-50-1234567` (both should work)

---

## Testing Scenarios

Use this sample data to test:

1. **Authentication**:
   - Login with: 050-1234567 (David Cohen - admin)
   - Login with: 053-7778888 (Yossi Green - tenant)
   - Login with: 050-9999999 (should fail - not in registry)

2. **List Available Parking**:
   - Should show 4 available listings (AV-2026-0001, 0002, 0003, 0005)
   - Should NOT show AV-2026-0004 (booked)

3. **Create Booking**:
   - User 052-3334444 books AV-2026-0001 (Ruth books David's parking)
   - Should succeed and change availability status to "booked"

4. **Conflict Detection**:
   - User tries to book P-007 for 2026-04-12 14:00-17:00
   - Should fail (overlaps with BK-2026-0001)

5. **Max 2 Parking Limit**:
   - Yonatan (053-1112233) has 1 confirmed booking (BK-2026-0001)
   - Book 2nd parking: should succeed
   - Try to book 3rd parking while first 2 active: should fail

6. **Linked Parking**:
   - Try booking only P-009: should fail (must book P-009 + P-010 together)
   - Try booking both P-009 and P-010: should succeed (if available)

7. **Tenant vs Owner Rights**:
   - Michael Levi (owner, non-resident) should NOT be able to list P-002 (rented to Greens)
   - Yossi Green (tenant) SHOULD be able to list P-002

---

## Sample Data Files

**For easy import, save as CSV files**:

1. `parking_sample.csv`
2. `owners_sample.csv`
3. `tenants_sample.csv`
4. `availability_sample.csv`
5. `bookings_sample.csv`
6. `users_registry_sample.csv`

**Note**: Holders table is auto-generated, no CSV needed.

---

## Maintenance After Initial Load

After inserting sample data:

1. Run Apps Script `syncUsersRegistry()` to verify auto-sync works
2. Run `dailyMaintenance()` to test auto-status updates
3. Manually verify Holders table reflects correct current holders
4. Test conditional formatting (colors should apply automatically)

---

## Next Steps

1. ✅ Insert sample data into Google Sheets
2. Verify data validation rules work
3. Test Apps Script functions with sample data
4. Use sample data for frontend development and testing
5. Create automated test suite based on these scenarios
