# Google Sheets Data Model Specification — MVP

## Overview

Database structure for Calanit parking management system (MVP for single building).

**Purpose**: Enable residents to rent parking spaces from each other short-term, free of charge, voluntarily.

**Scope**: One residential building, hourly rental slots (1 hour minimum), private parking only.

**Timezone**: All datetime fields use Jerusalem timezone (Asia/Jerusalem)
**Phone Format**: Israeli mobile format `050-1234567` or `+972-50-1234567`

---

## Tables Overview

| Table     | Purpose                                | Managed By  |
|-----------|----------------------------------------|-------------|
| Parking   | List of all parking spaces             | Admin       |
| Owners    | Apartment owners                       | Admin       |
| Tenants   | Current tenants                        | Admin       |
| Residents | Current residents (auto-generated)     | Auto-formula|

---

## Table 1: Parking

Stores information about all parking spaces in the building.

| Column        | Type    | Required | Auto-Generated | Description                  | Example      |
|---------------|---------|----------|----------------|------------------------------|--------------|
| parking_id    | String  | Yes      | Yes            | Unique parking identifier    | P-001        |
| type          | Enum    | Yes      | No             | Parking type                 | regular      |
| linked_id     | String  | No       | No             | Linked tandem parking ID     | P-002        |

**Parking Types** (dropdown values):
1. `regular` — Standard parking space (majority)
2. `tandem` — Tandem parking (one car blocks another's exit, must be rented in pairs)
3. `wheelchair` — Accessible parking space for wheelchair users

**Validation Rules**:
- `parking_id`: Auto-generated (P-001, P-002, etc.), unique, read-only
- `type`: Must be one of 3 types (dropdown)
- `linked_id`: Required if `type = tandem`, must reference another parking with `type = tandem`
- Tandem parking pairs must reference each other (P-001 → P-002, P-002 → P-001)

**Data Validation Setup**:
- Column B (type): Dropdown list with values: `regular, tandem, wheelchair`
- Column C (linked_id): Dropdown from Parking!A:A (parking_id column)

**Conditional Formatting**:
- Tandem parking: Highlight yellow when type = "tandem"
- Wheelchair parking: Highlight light blue when type = "wheelchair"

---

## Table 2: Owners

Stores information about apartment owners.

| Column         | Type   | Required | Auto-Generated | Description                      | Example           |
|----------------|--------|----------|----------------|----------------------------------|-------------------|
| owner_id       | String | Yes      | Yes            | Unique owner identifier          | OWN-001           |
| apartment      | String | Yes      | No             | Apartment number                 | 5                 |
| first_name     | String | Yes      | No             | Owner's first name               | David             |
| family_name    | String | Yes      | No             | Owner's family name              | Cohen             |
| phone          | String | Yes      | No             | Israeli mobile number            | 050-1234567       |
| email          | String | No       | No             | Email address                    | david@example.com |
| storage        | String | No       | No             | Storage room number(s)           | S-05              |
| parking_spaces | String | No       | No             | Parking number(s)                | P-005,P-006       |

**Validation Rules**:
- `owner_id`: Auto-generated (OWN-001, OWN-002, etc.), unique, read-only
- `phone`: Format `/^(\+972-)?05[0-9]-[0-9]{7}$/` (both formats accepted)
- `phone`: Must be unique across Owners and Tenants tables
- `email`: Optional, standard email validation
- `apartment`: Text field (some buildings use "5A", "5B" notation)
- `parking_spaces`: Multi-select dropdown from Parking table (comma-separated values)
  - For tandem pairs: selecting one auto-adds the linked parking

**Data Validation Setup**:
- Column E (phone): Custom formula to validate Israeli phone format
- Column H (parking_spaces): Multi-select dropdown from Parking!A:A

---

## Table 3: Tenants

Stores information about current tenants.

| Column         | Type   | Required | Auto-Generated | Description                      | Example           |
|----------------|--------|----------|----------------|----------------------------------|-------------------|
| tenant_id      | String | Yes      | Yes            | Unique tenant identifier         | TEN-001           |
| apartment      | String | Yes      | No             | Apartment number                 | 12                |
| first_name     | String | Yes      | No             | Tenant's first name              | Yossi             |
| family_name    | String | Yes      | No             | Tenant's family name             | Green             |
| phone          | String | Yes      | No             | Israeli mobile number            | 053-7778888       |
| email          | String | No       | No             | Email address                    | yossi@example.com |
| storage        | String | No       | No             | Storage room number(s)           | S-12              |
| parking_spaces | String | No       | No             | Parking number(s)                | P-012             |

**Validation Rules**:
- `tenant_id`: Auto-generated (TEN-001, TEN-002, etc.), unique, read-only
- `phone`: Format `/^(\+972-)?05[0-9]-[0-9]{7}$/`
- `phone`: Must be unique across Owners and Tenants tables
- `apartment`: Must exist in Owners table (tenants rent from owners)
- `parking_spaces`: Multi-select dropdown from Parking table

**Business Logic**:
- When a tenant record exists for an apartment, the tenant becomes the current resident
- When tenant lease ends, admin deletes the tenant record (owner becomes resident again)

**Data Validation Setup**:
- Column E (phone): Same validation as Owners
- Column H (parking_spaces): Multi-select dropdown from Parking!A:A

---

## Table 4: Residents (Auto-Generated)

**This table is auto-filled via Google Sheets formulas — admin does not edit manually.**

Consolidated view of current residents (who can use the parking rental app).

| Column         | Type   | Source        | Description                      | Example           |
|----------------|--------|---------------|----------------------------------|-------------------|
| resident_id    | String | Auto          | Unique identifier                | R-001             |
| apartment      | String | Owner/Tenant  | Apartment number                 | 12                |
| first_name     | String | Owner/Tenant  | Resident's first name            | Yossi             |
| family_name    | String | Owner/Tenant  | Resident's family name           | Green             |
| phone          | String | Owner/Tenant  | Phone number                     | 053-7778888       |
| email          | String | Owner/Tenant  | Email address                    | yossi@example.com |
| storage        | String | Owner/Tenant  | Storage room number              | S-12              |
| parking_spaces | String | Owner/Tenant  | Parking number(s)                | P-012             |

**Formula Logic**:

For each apartment:
1. Check if apartment exists in Tenants table
2. If YES → use Tenant data
3. If NO → use Owner data

**Implementation**: Use QUERY or ARRAYFORMULA to merge Owners and Tenants, prioritizing Tenants when apartment exists in both tables.

---

## Sample Data Requirements

Template should include realistic test data:

### Parking Spaces
- 15 total parking spaces
- Type breakdown:
  - 11 regular (73%)
  - 2 tandem pairs = 4 spaces (27%)
  - 0 wheelchair (will add later if needed)

### Owners
- 12 apartments with owners
- Mix of single owners and co-owners (some apartments have 2 owners)
- Some apartments have multiple parking spaces
- Some have no parking (street parking only)

### Tenants
- 4 apartments rented
- Tenants have parking transferred from owner

### Residents
- Auto-generated: 12 apartments total
- 4 show tenant data
- 8 show owner data

---

## Google Sheets Setup Instructions

### Auto-Generated IDs

**Parking.parking_id (Column A)**:
```
=IF(B2<>"", "P-" & TEXT(ROW()-1, "000"), "")
```
- Generates P-001, P-002, etc.
- Only generates if type (column B) is filled

**Owners.owner_id (Column A)**:
```
=IF(B2<>"", "OWN-" & TEXT(ROW()-1, "000"), "")
```
- Generates OWN-001, OWN-002, etc.
- Only generates if apartment (column B) is filled

**Tenants.tenant_id (Column A)**:
```
=IF(B2<>"", "TEN-" & TEXT(ROW()-1, "000"), "")
```
- Generates TEN-001, TEN-002, etc.
- Only generates if apartment (column B) is filled

**Residents.resident_id (Column A)**:
```
=IF(B2<>"", "R-" & TEXT(ROW()-1, "000"), "")
```
- Generates R-001, R-002, etc.
- Auto-generated as part of the main formula

### Protecting Auto-Generated Columns

1. Select column A in each sheet (Parking, Owners, Tenants, Residents)
2. Data → Protect sheets and ranges
3. Set range: `Sheet!A:A`
4. Permissions: "Show a warning when editing this range"
5. Description: "Auto-generated IDs - do not edit manually"

This allows viewing but warns before editing.

### Multi-Select Parking Dropdown

**Challenge**: Google Sheets does not natively support multi-select dropdowns.

**Solutions**:

**Option 1: Manual Comma-Separated Entry with Validation**
1. Use Data Validation on parking_spaces column
2. Criteria: Custom formula `=COUNTIF(Parking!$A:$A, SPLIT(H2, ","))=COUNTA(SPLIT(H2, ","))`
3. User manually types: `P-001,P-002`
4. Formula validates each ID exists in Parking table

**Option 2: Apps Script for Multi-Select**
- Create custom dropdown with checkboxes using Apps Script
- More user-friendly but requires coding
- See `docs/google-sheets-setup.md` for implementation

**Option 3: Helper Columns**
- Parking_1, Parking_2, Parking_3 columns with simple dropdowns
- CONCATENATE them into parking_spaces
- More columns but simpler setup

### Tandem Pair Auto-Add

**Challenge**: Selecting one tandem parking should auto-add its pair.

**Solution**: Apps Script `onEdit` trigger

```javascript
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  
  // Only run on Owners/Tenants parking_spaces column (column H)
  if ((sheet.getName() === "Owners" || sheet.getName() === "Tenants") && 
      range.getColumn() === 8) {
    
    const parkingSheet = e.source.getSheetByName("Parking");
    const parkingData = parkingSheet.getDataRange().getValues();
    
    const selectedIds = range.getValue().toString().split(",");
    const allIds = [];
    
    selectedIds.forEach(id => {
      const trimmedId = id.trim();
      allIds.push(trimmedId);
      
      // Find this parking in Parking table
      for (let i = 1; i < parkingData.length; i++) {
        if (parkingData[i][0] === trimmedId && parkingData[i][1] === "tandem") {
          const linkedId = parkingData[i][2];
          if (linkedId && !allIds.includes(linkedId)) {
            allIds.push(linkedId);
          }
        }
      }
    });
    
    range.setValue(allIds.join(","));
  }
}
```

### Preventing Duplicate parking_id / linked_id

**For parking_id (auto-generated)**: Already unique by formula (based on row number).

**For linked_id**: 
1. Column C Data Validation
2. Custom formula: `=COUNTIF($C:$C, C2)<=1`
3. Reject input if duplicate
4. Show warning: "This parking ID is already used as a linked_id"

**Additional check** (Apps Script):
```javascript
function validateLinkedId(e) {
  const sheet = e.source.getActiveSheet();
  if (sheet.getName() !== "Parking") return;
  
  const range = e.range;
  if (range.getColumn() === 3) { // linked_id column
    const linkedId = range.getValue();
    const parkingId = range.offset(0, -2).getValue(); // Column A
    
    // Check linked parking exists and links back
    const parkingSheet = e.source.getSheetByName("Parking");
    const parkingData = parkingSheet.getDataRange().getValues();
    
    let foundMatch = false;
    for (let i = 1; i < parkingData.length; i++) {
      if (parkingData[i][0] === linkedId) {
        if (parkingData[i][2] === parkingId) {
          foundMatch = true;
        }
        break;
      }
    }
    
    if (!foundMatch) {
      Browser.msgBox("Warning: Linked parking " + linkedId + " does not link back to " + parkingId);
    }
  }
}
```

---

## Residents Table Auto-Population Formula

**Goal**: Merge Owners and Tenants, prioritizing Tenants when apartment exists in both.

**Formula for Residents!A2**:

```
=ARRAYFORMULA(
  IF(ROW(A:A)=1, 
    {"resident_id","apartment","first_name","family_name","phone","email","storage","parking_spaces"},
    IF(LEN(A:A),
      IFERROR(
        QUERY(
          {
            Tenants!A2:A & "~" & Tenants!B2:B & "~" & Tenants!C2:C & "~" & Tenants!D2:D & "~" & Tenants!E2:E & "~" & Tenants!F2:F & "~" & Tenants!G2:G & "~" & Tenants!H2:H, 
            "TENANT";
            Owners!A2:A & "~" & Owners!B2:B & "~" & Owners!C2:C & "~" & Owners!D2:D & "~" & Owners!E2:E & "~" & Owners!F2:F & "~" & Owners!G2:G & "~" & Owners!H2:H, 
            "OWNER"
          },
          "SELECT * WHERE Col1 <> '~~~~~~~' ORDER BY Col2, Col9"
        ),
      )
    ,)
  )
)
```

**Simpler Alternative (Recommended)**:

Place this in Residents!B2 (apartment column):
```
=UNIQUE(SORT(FILTER({Owners!B2:B;Tenants!B2:B}, LEN({Owners!B2:B;Tenants!B2:B})>0)))
```

Then for each row, use VLOOKUP to check Tenants first:

Residents!A2:
```
="R-" & TEXT(ROW()-1, "000")
```

Residents!C2 (first_name):
```
=IFERROR(VLOOKUP(B2, Tenants!$B:$C, 2, FALSE), VLOOKUP(B2, Owners!$B:$C, 2, FALSE))
```

Residents!D2 (family_name):
```
=IFERROR(VLOOKUP(B2, Tenants!$B:$D, 3, FALSE), VLOOKUP(B2, Owners!$B:$D, 3, FALSE))
```

Residents!E2 (phone):
```
=IFERROR(VLOOKUP(B2, Tenants!$B:$E, 4, FALSE), VLOOKUP(B2, Owners!$B:$E, 4, FALSE))
```

Residents!F2 (email):
```
=IFERROR(VLOOKUP(B2, Tenants!$B:$F, 5, FALSE), VLOOKUP(B2, Owners!$B:$F, 5, FALSE))
```

Residents!G2 (storage):
```
=IFERROR(VLOOKUP(B2, Tenants!$B:$G, 6, FALSE), VLOOKUP(B2, Owners!$B:$G, 6, FALSE))
```

Residents!H2 (parking_spaces):
```
=IFERROR(VLOOKUP(B2, Tenants!$B:$H, 7, FALSE), VLOOKUP(B2, Owners!$B:$H, 7, FALSE))
```

Copy formulas down for all rows with apartments.

---

## Next Steps

1. Create Google Sheets with 4 tables
2. Set up auto-generated ID formulas
3. Configure data validation dropdowns
4. Implement Residents auto-population formulas
5. Insert sample data for testing
6. Create simple mobile web interface to display Residents and Parking data
