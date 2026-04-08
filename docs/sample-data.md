# Sample Data for Calanit Database — MVP

## Overview

Realistic test data for initial Google Sheets setup and basic testing.

**Scope**:
- Single building MVP
- 15 parking spaces (11 regular, 4 tandem in 2 pairs, 0 wheelchair initially)
- 12 apartments with owners
- 4 apartments with tenants
- Residents table auto-generates from above

**Important**: This is simplified MVP data. Focus on core parking + resident tables only.

---

## Table 1: Parking (15 spaces)

Copy this data into Parking sheet starting at row 2 (column B - type). Column A (parking_id) will auto-generate.

| type | linked_id |
|---|---|
| regular | |
| regular | |
| regular | |
| tandem | P-005 |
| tandem | P-004 |
| regular | |
| regular | |
| tandem | P-009 |
| tandem | P-008 |
| regular | |
| regular | |
| regular | |
| regular | |
| regular | |
| regular | |

**After pasting**:
- Column A should auto-generate: P-001, P-002, ..., P-015
- P-004 and P-005 are tandem pair (link each other)
- P-008 and P-009 are tandem pair (link each other)
- Yellow highlighting should appear for tandem parking (conditional formatting)

**Type Distribution**:
- Regular: 11 (73%)
- Tandem: 4 in 2 pairs (27%)
- Wheelchair: 0 (can add later if needed)

---

## Table 2: Owners (12 owners for 12 apartments)

Copy this data into Owners sheet starting at row 2 (column B - apartment). Column A (owner_id) will auto-generate.

| apartment | first_name | family_name | phone | email | storage | parking_spaces |
|---|---|---|---|---|---|---|
| 1 | David | Cohen | 050-1234567 | david.cohen@example.com | S-01 | P-001 |
| 2 | Michael | Levi | 054-5551234 | michael.levi@example.com | S-02 | P-002 |
| 3 | Ruth | Katz | 052-3334444 | ruth.katz@example.com | S-03 | P-003 |
| 4 | Avi | Mizrahi | 050-5556666 | avi.mizrahi@example.com | S-04 | P-004,P-005 |
| 5 | Eitan | Goldberg | 052-4445555 | eitan.goldberg@example.com | S-05 | P-006 |
| 6 | Yonatan | Shapiro | 053-1112233 | yonatan.shapiro@example.com | S-06 | P-007 |
| 7 | Noa | Ben-David | 050-2223344 | noa.bendavid@example.com | S-07 | P-008,P-009 |
| 8 | Daniel | Zohar | 052-5556677 | daniel.zohar@example.com | S-08 | P-010 |
| 9 | Shira | Israeli | 054-8889900 | shira.israeli@example.com | S-09 | P-011 |
| 10 | Moshe | Kohen | 050-3334455 | moshe.kohen@example.com | S-10 | P-012 |
| 11 | Rachel | Alon | 053-6667788 | rachel.alon@example.com | S-11 | P-013 |
| 12 | Uri | Segal | 052-7778899 | uri.segal@example.com | S-12 | |

**After pasting**:
- Column A should auto-generate: OWN-001, OWN-002, ..., OWN-012
- Phone validation should accept these formats
- Apartment 4 has tandem pair P-004,P-005
- Apartment 7 has tandem pair P-008,P-009
- Apartment 12 has no parking (Uri Segal - street parking only)

**Notes**:
- Mix of single/multiple parking owners
- One owner with no parking (Uri)
- Two owners with tandem parking pairs (Avi, Noa)

---

## Table 3: Tenants (4 tenants)

Copy this data into Tenants sheet starting at row 2 (column B - apartment). Column A (tenant_id) will auto-generate.

| apartment | first_name | family_name | phone | email | storage | parking_spaces |
|---|---|---|---|---|---|---|
| 2 | Yossi | Green | 053-7778888 | yossi.green@example.com | S-02 | P-002 |
| 4 | Dan | Shapiro | 053-1231236 | dan.shapiro@example.com | S-04 | P-004,P-005 |
| 7 | Gal | Eshel | 052-7776665 | gal.eshel@example.com | S-07 | P-008,P-009 |
| 10 | Meir | Hazan | 054-5554443 | meir.hazan@example.com | S-10 | P-012 |

**After pasting**:
- Column A should auto-generate: TEN-001, TEN-002, TEN-003, TEN-004
- Light green background should appear (conditional formatting for tenants)
- Tenants take over apartments 2, 4, 7, 10 from owners

**Notes**:
- Yossi Green rents from Michael Levi (apartment 2)
- Dan Shapiro rents from Avi Mizrahi (apartment 4, tandem parking)
- Gal Eshel rents from Noa Ben-David (apartment 7, tandem parking)
- Meir Hazan rents from Moshe Kohen (apartment 10)

---

## Table 4: Residents (Auto-Generated)

**DO NOT manually enter data here.** This table auto-populates via formulas.

After setting up formulas in Residents sheet (see `docs/google-sheets-setup.md`), you should see:

| resident_id | apartment | first_name | family_name | phone | email | storage | parking_spaces |
|---|---|---|---|---|---|---|---|
| R-001 | 1 | David | Cohen | 050-1234567 | david.cohen@example.com | S-01 | P-001 |
| R-002 | 2 | Yossi | Green | 053-7778888 | yossi.green@example.com | S-02 | P-002 |
| R-003 | 3 | Ruth | Katz | 052-3334444 | ruth.katz@example.com | S-03 | P-003 |
| R-004 | 4 | Dan | Shapiro | 053-1231236 | dan.shapiro@example.com | S-04 | P-004,P-005 |
| R-005 | 5 | Eitan | Goldberg | 052-4445555 | eitan.goldberg@example.com | S-05 | P-006 |
| R-006 | 6 | Yonatan | Shapiro | 053-1112233 | yonatan.shapiro@example.com | S-06 | P-007 |
| R-007 | 7 | Gal | Eshel | 052-7776665 | gal.eshel@example.com | S-07 | P-008,P-009 |
| R-008 | 8 | Daniel | Zohar | 052-5556677 | daniel.zohar@example.com | S-08 | P-010 |
| R-009 | 9 | Shira | Israeli | 054-8889900 | shira.israeli@example.com | S-09 | P-011 |
| R-010 | 10 | Meir | Hazan | 054-5554443 | meir.hazan@example.com | S-10 | P-012 |
| R-011 | 11 | Rachel | Alon | 053-6667788 | rachel.alon@example.com | S-11 | P-013 |
| R-012 | 12 | Uri | Segal | 052-7778899 | uri.segal@example.com | S-12 | |

**What to verify**:
- Apartments 2, 4, 7, 10 show **TENANT** data (not owner data)
- Apartments 1, 3, 5, 6, 8, 9, 11, 12 show **OWNER** data
- Total 12 residents (one per apartment)
- resident_id auto-generates R-001 through R-012

**Logic Test**:
- Michael Levi (owner of apt 2) should NOT appear in Residents
- Yossi Green (tenant of apt 2) SHOULD appear in Residents
- This confirms tenants have priority over owners

---

## Data Insertion Instructions

### Step-by-Step Copy-Paste:

**1. Parking Sheet**:
- Open Google Sheets → Parking sheet
- Click cell B2 (type column)
- Copy table above (just the data rows, not headers)
- Paste into B2
- Verify:
  - Column A auto-generates P-001 to P-015
  - P-004 has linked_id = P-005, P-005 has linked_id = P-004
  - P-008 has linked_id = P-009, P-009 has linked_id = P-008
  - Tandem rows highlighted yellow

**2. Owners Sheet**:
- Click cell B2 (apartment column)
- Copy table above
- Paste into B2
- Verify:
  - Column A auto-generates OWN-001 to OWN-012
  - Phone validation works (try typing invalid phone - should reject)
  - Tandem parking shows as comma-separated (P-004,P-005)

**3. Tenants Sheet**:
- Click cell B2 (apartment column)
- Copy table above
- Paste into B2
- Verify:
  - Column A auto-generates TEN-001 to TEN-004
  - Rows highlighted light green
  - Apartments match: 2, 4, 7, 10

**4. Residents Sheet**:
- DO NOT paste data
- Verify formulas auto-populate data
- Check apartments 2, 4, 7, 10 show tenant names (not owner names)

---

## Testing Scenarios

Use this sample data to test:

### 1. Resident Priority Logic
- Check Residents table apartment 2:
  - Should show: Yossi Green (tenant)
  - Should NOT show: Michael Levi (owner)
- Reason: Tenants have priority in formulas

### 2. Tandem Parking Assignment
- Avi Mizrahi (apartment 4) has P-004,P-005
- Verify both parking IDs appear in parking_spaces
- Verify they are linked in Parking table

### 3. No Parking Scenario
- Uri Segal (apartment 12) has no parking
- Verify parking_spaces is empty (not error)

### 4. Phone Validation
- Try entering invalid phone in Owners sheet: `050-123` (should reject)
- Try valid format: `050-1234567` (should accept)
- Try international format: `+972-50-1234567` (should accept)

### 5. Auto-ID Generation
- Add new owner in Owners sheet row 14
- Enter apartment = "13"
- Verify owner_id auto-generates as OWN-013
- Delete row 14 data
- Verify owner_id disappears (formula conditional on apartment)

### 6. Residents Auto-Update
- Change tenant's first name in Tenants sheet (Yossi → Joseph)
- Check Residents table apartment 2
- Should immediately update to "Joseph"

### 7. Tandem Auto-Add (if Apps Script enabled)
- In Owners sheet, add new owner
- Manually type parking_spaces = P-004
- If Apps Script working: should auto-add P-005 → becomes P-004,P-005
- If Apps Script not enabled: manual entry works, just no auto-add

---

## What This Data Tests

**Coverage**:
- ✅ Regular parking (11 spaces)
- ✅ Tandem parking (2 pairs)
- ✅ Owner-occupied apartments (8)
- ✅ Tenant-occupied apartments (4)
- ✅ Residents priority logic (tenant > owner)
- ✅ No parking scenario (apartment 12)
- ✅ Multiple parking per apartment (apartments 4, 7)
- ✅ Single parking per apartment (apartments 1, 2, 3, etc.)

**Not Covered (Future Phase)**:
- ❌ Wheelchair parking (can add P-016 later)
- ❌ Common parking (building-owned)
- ❌ Multi-building support
- ❌ Storage room functionality
- ❌ Availability/booking records
- ❌ Non-resident owners
- ❌ Co-owners (couples)

---

## Sample Data Statistics

| Metric | Count | Percentage |
|---|---|---|
| Total Parking | 15 | 100% |
| - Regular | 11 | 73% |
| - Tandem | 4 (2 pairs) | 27% |
| - Wheelchair | 0 | 0% |
| Total Apartments | 12 | 100% |
| - Owner-occupied | 8 | 67% |
| - Tenant-occupied | 4 | 33% |
| Parking per Apartment | | |
| - 0 parking | 1 (apt 12) | 8% |
| - 1 parking | 9 | 75% |
| - 2 parking (tandem) | 2 (apt 4, 7) | 17% |

---

## Next Steps

1. ✅ Insert sample data into Google Sheets
2. Verify all auto-generation formulas work
3. Test data validation rules
4. Test Residents auto-population
5. Begin planning simple mobile web interface to display Parking and Residents lists

---

## Adding More Data Later

If you want to expand this dataset:

**Add regular parking**:
- Row 16 in Parking sheet: type = "regular", linked_id = empty
- Will generate P-016

**Add wheelchair parking**:
- Row 17 in Parking sheet: type = "wheelchair", linked_id = empty
- Will generate P-017
- Should highlight light blue automatically

**Add another tandem pair**:
- Row 18: type = "tandem", linked_id = P-019
- Row 19: type = "tandem", linked_id = P-018
- Should highlight yellow automatically
- Verify bidirectional link (P-018 ↔ P-019)

**Add more apartments**:
- Add rows to Owners sheet for apartments 13, 14, etc.
- Assign existing or new parking spaces
- Residents table will auto-update

**Convert owner to tenant**:
- Add row in Tenants sheet with same apartment number
- Residents table will automatically show tenant (priority logic)
- Owner data remains in Owners sheet but doesn't appear in Residents
