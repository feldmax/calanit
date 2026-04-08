# Google Sheets Setup Guide — MVP

## Overview

Step-by-step instructions for creating the Calanit parking management database in Google Sheets.

**Scope**: Single building, MVP version with 4 tables (Parking, Owners, Tenants, Residents)

**Important**: Residents table is auto-generated via formulas. Only Parking, Owners, and Tenants require manual data entry.

---

## Step 1: Create New Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create new spreadsheet
3. Name it: **Calanit_DB**
4. Share settings: Private (only admin has access initially)

---

## Step 2: Create Sheets

Create sheets in this exact order:

1. **Parking** (rename Sheet1)
2. **Owners** (add new sheet)
3. **Tenants** (add new sheet)
4. **Residents** (add new sheet - auto-generated)

---

## Step 3: Setup Parking Sheet

### Column Headers (Row 1):
```
parking_id | type | linked_id
```

### Data Validation Setup:

**Column B (type)** - Dropdown list:
- Data > Data validation > List from a range
- Criteria: List of items
- Values (separated by commas): `regular, tandem, wheelchair`
- Show validation help text: "Choose parking type"
- On invalid data: Reject input

**Column C (linked_id)** - Dropdown from Parking IDs:
- Data > Data validation > List from a range
- Criteria: `=Parking!$A$2:$A$100` (adjust range as needed)
- Show dropdown list
- On invalid data: Show warning
- Only fill this if type = "tandem"

**Column C (linked_id)** - Prevent duplicates:
- Additional validation: Data > Data validation
- Custom formula: `=COUNTIF($C:$C, C2)<=1`
- On invalid data: Reject input
- Custom error text: "This parking ID is already linked to another parking"

### Conditional Formatting:

1. **Tandem parking** (yellow):
   - Range: A2:C100
   - Format rules > Custom formula is: `=$B2="tandem"`
   - Formatting style: Light yellow 3 background (#FFF9C4)

2. **Wheelchair parking** (light blue):
   - Range: A2:C100
   - Format rules > Custom formula is: `=$B2="wheelchair"`
   - Formatting style: Light blue 3 background (#B3E5FC)

### Formula for parking_id (Column A):

Cell A2:
```
=IF(B2<>"", "P-" & TEXT(ROW()-1, "000"), "")
```

**How it works**:
- Checks if type (column B) is filled
- If yes, generates ID: P-001, P-002, P-003, etc.
- If no, leaves blank

**Setup**:
1. Enter formula in A2
2. Drag down to A100 (or expected max parking count)
3. Formula will auto-generate IDs as you fill column B

### Protect parking_id column:

1. Select column A (entire column)
2. Data > Protect sheets and ranges
3. Set range: `Parking!A:A`
4. Description: "Auto-generated parking IDs - do not edit manually"
5. Permissions: "Show a warning when editing this range"
6. Click "Done"

---

## Step 4: Setup Owners Sheet

### Column Headers (Row 1):
```
owner_id | apartment | first_name | family_name | phone | email | storage | parking_spaces
```

### Data Validation Setup:

**Column E (phone)** - Format validation:
- Data > Data validation > Custom formula is
- Formula: `=REGEXMATCH(E2,"^(\+972-)?05[0-9]-[0-9]{7}$")`
- On invalid data: Reject input
- Custom error text: "Phone must be Israeli mobile format: 050-1234567 or +972-50-1234567"

**Column F (email)** - Email validation (optional):
- Data > Data validation > Text
- Criteria: Is valid email
- On invalid data: Show warning

**Column H (parking_spaces)** - Multi-select parking:
- See "Multi-Select Parking Setup" section below
- Basic setup: Allow text entry with validation

### Formula for owner_id (Column A):

Cell A2:
```
=IF(B2<>"", "OWN-" & TEXT(ROW()-1, "000"), "")
```

**Setup**: Enter in A2, drag down to A50 (or expected max owners)

### Protect owner_id column:

1. Select column A
2. Data > Protect sheets and ranges
3. Range: `Owners!A:A`
4. Description: "Auto-generated owner IDs - do not edit manually"
5. Permissions: "Show a warning when editing this range"

---

## Step 5: Setup Tenants Sheet

### Column Headers (Row 1):
```
tenant_id | apartment | first_name | family_name | phone | email | storage | parking_spaces
```

### Data Validation Setup:

**Column E (phone)** - Same as Owners sheet:
```
=REGEXMATCH(E2,"^(\+972-)?05[0-9]-[0-9]{7}$")
```

**Column F (email)** - Same as Owners sheet

**Column H (parking_spaces)** - Same as Owners sheet

### Conditional Formatting:

1. **Tenant rows** (light green):
   - Range: A2:H50
   - Format rules > Custom formula is: `=$B2<>""`
   - Formatting style: Light green 3 background (#C8E6C9)
   - This helps distinguish tenant records at a glance

### Formula for tenant_id (Column A):

Cell A2:
```
=IF(B2<>"", "TEN-" & TEXT(ROW()-1, "000"), "")
```

**Setup**: Enter in A2, drag down to A50

### Protect tenant_id column:

1. Select column A
2. Data > Protect sheets and ranges
3. Range: `Tenants!A:A`
4. Description: "Auto-generated tenant IDs - do not edit manually"
5. Permissions: "Show a warning when editing this range"

---

## Step 6: Setup Residents Sheet (Auto-Generated)

**⚠️ CRITICAL**: This sheet is auto-populated via formulas. Admin should NOT edit manually except to set up initial formulas.

### Column Headers (Row 1):
```
resident_id | apartment | first_name | family_name | phone | email | storage | parking_spaces
```

### Auto-Population Approach (Recommended):

**Step 1: Generate unique apartment list**

Cell B2:
```
=UNIQUE(SORT(FILTER({Owners!B:B;Tenants!B:B}, LEN({Owners!B:B;Tenants!B:B})>0)))
```

**What this does**:
- Combines apartments from Owners and Tenants
- Filters out empty cells
- Removes duplicates (UNIQUE)
- Sorts alphabetically/numerically

**Step 2: Generate resident_id**

Cell A2:
```
=IF(B2<>"", "R-" & TEXT(ROW()-1, "000"), "")
```

**Step 3: Lookup data, prioritizing Tenants over Owners**

Cell C2 (first_name):
```
=IFERROR(VLOOKUP(B2, Tenants!$B:$C, 2, FALSE), VLOOKUP(B2, Owners!$B:$C, 2, FALSE))
```

Cell D2 (family_name):
```
=IFERROR(VLOOKUP(B2, Tenants!$B:$D, 3, FALSE), VLOOKUP(B2, Owners!$B:$D, 3, FALSE))
```

Cell E2 (phone):
```
=IFERROR(VLOOKUP(B2, Tenants!$B:$E, 4, FALSE), VLOOKUP(B2, Owners!$B:$E, 4, FALSE))
```

Cell F2 (email):
```
=IFERROR(VLOOKUP(B2, Tenants!$B:$F, 5, FALSE), VLOOKUP(B2, Owners!$B:$F, 5, FALSE))
```

Cell G2 (storage):
```
=IFERROR(VLOOKUP(B2, Tenants!$B:$G, 6, FALSE), VLOOKUP(B2, Owners!$B:$G, 6, FALSE))
```

Cell H2 (parking_spaces):
```
=IFERROR(VLOOKUP(B2, Tenants!$B:$H, 7, FALSE), VLOOKUP(B2, Owners!$B:$H, 7, FALSE))
```

**How it works**:
- `IFERROR(VLOOKUP(...Tenants...), VLOOKUP(...Owners...))` checks Tenants table first
- If apartment found in Tenants → use Tenant data
- If not found (IFERROR catches the error) → use Owner data
- This ensures current residents are always shown (tenants take priority)

**Step 4: Copy formulas down**

1. Select cells A2:H2
2. Drag down to cover all expected residents (should match the count from UNIQUE formula in B2)
3. Formulas will automatically populate as apartments appear in Owners/Tenants

### Protect Residents Sheet:

1. Select entire Residents sheet
2. Data > Protect sheets and ranges
3. Set permissions: "Show a warning when editing this range"
4. Description: "Auto-generated resident data - do not edit manually"
5. Exception: Allow yourself (admin) to edit (needed for initial formula setup)

---

## Multi-Select Parking Setup

### Challenge

Google Sheets does not natively support multi-select dropdowns. When users can have multiple parking spaces (e.g., `P-001,P-002`), we need workarounds.

### Option 1: Manual Comma-Separated Entry with Validation (Simplest)

**Setup**:

Column H (parking_spaces) in Owners/Tenants sheets:

1. Data > Data validation > Custom formula is
2. Formula:
```
=OR(H2="", COUNTIF(Parking!$A:$A, SPLIT(H2, ","))=COUNTA(SPLIT(H2, ",")))
```
3. On invalid data: Reject input
4. Custom error text: "Enter parking IDs separated by commas (e.g., P-001,P-002). All IDs must exist in Parking table."

**Usage**:
- User types: `P-001,P-002`
- Formula validates each ID exists in Parking table
- Rejects input if any ID is invalid

**Pros**: Simple, no scripting required  
**Cons**: Manual typing, no visual selection, typo-prone

### Option 2: Apps Script Multi-Select Dropdown (Better UX)

**Setup**:

1. In spreadsheet: Extensions > Apps Script
2. Create new script file: `MultiSelectDropdown.gs`
3. Paste this code:

```javascript
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  
  // Only run on Owners/Tenants parking_spaces column (column H)
  if ((sheet.getName() === "Owners" || sheet.getName() === "Tenants") && 
      range.getColumn() === 8) {
    
    const parkingSheet = e.source.getSheetByName("Parking");
    const parkingData = parkingSheet.getDataRange().getValues();
    
    // Get all parking IDs
    const parkingIds = [];
    for (let i = 1; i < parkingData.length; i++) {
      if (parkingData[i][0]) { // parking_id exists
        parkingIds.push(parkingData[i][0]);
      }
    }
    
    // Show custom dialog for multi-select
    const htmlOutput = HtmlService
      .createHtmlOutput(getMultiSelectHTML(parkingIds, range.getValue()))
      .setWidth(300)
      .setHeight(400);
    
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Select Parking Spaces');
  }
}

function getMultiSelectHTML(parkingIds, currentValue) {
  const selected = currentValue ? currentValue.split(",").map(id => id.trim()) : [];
  
  let html = '<style>body{font-family:Arial;padding:10px;} .checkbox-item{margin:8px 0;}</style>';
  html += '<form id="parkingForm">';
  
  parkingIds.forEach(id => {
    const checked = selected.includes(id) ? 'checked' : '';
    html += `<div class="checkbox-item"><input type="checkbox" name="parking" value="${id}" ${checked}> ${id}</div>`;
  });
  
  html += '<br><button type="button" onclick="submitSelection()">OK</button>';
  html += '<button type="button" onclick="google.script.host.close()">Cancel</button>';
  html += '</form>';
  
  html += `<script>
    function submitSelection() {
      const checkboxes = document.querySelectorAll('input[name="parking"]:checked');
      const values = Array.from(checkboxes).map(cb => cb.value);
      google.script.run.withSuccessHandler(google.script.host.close).updateCell(values);
    }
  </script>`;
  
  return html;
}

function updateCell(selectedValues) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getActiveRange();
  range.setValue(selectedValues.join(","));
}
```

4. Save script
5. Authorize script when prompted

**Usage**:
- Click on parking_spaces cell (column H)
- Custom dialog appears with checkboxes for all parking
- Select multiple, click OK
- Cell updates with comma-separated list

**Pros**: User-friendly, visual selection, prevents typos  
**Cons**: Requires Apps Script, slightly more complex setup

### Option 3: Helper Columns (Alternative)

**Setup**:

Instead of one `parking_spaces` column, use three:

```
parking_1 | parking_2 | parking_3 | parking_spaces (hidden)
```

- parking_1, parking_2, parking_3: Simple dropdown from Parking!A:A
- parking_spaces (hidden): Formula `=TEXTJOIN(",", TRUE, H2, I2, J2)`

**Pros**: Simple dropdowns, no scripting  
**Cons**: More columns, limited to 3 parking spaces

---

## Tandem Parking Auto-Add

### Challenge

When user selects a tandem parking (e.g., P-003), the linked pair (P-004) should be automatically added to selection.

### Solution: Apps Script onEdit Trigger

**Setup**:

1. In Apps Script project: Extensions > Apps Script
2. Create new file: `TandemAutoAdd.gs`
3. Paste this code:

```javascript
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  
  // Only run on Owners/Tenants parking_spaces column (column H)
  if ((sheet.getName() === "Owners" || sheet.getName() === "Tenants") && 
      range.getColumn() === 8) {
    
    const parkingSheet = e.source.getSheetByName("Parking");
    const parkingData = parkingSheet.getDataRange().getValues();
    
    const selectedIds = range.getValue().toString().split(",").map(id => id.trim()).filter(id => id);
    const allIds = [];
    
    selectedIds.forEach(id => {
      allIds.push(id);
      
      // Find this parking in Parking table
      for (let i = 1; i < parkingData.length; i++) {
        const parkingId = parkingData[i][0];
        const parkingType = parkingData[i][1];
        const linkedId = parkingData[i][2];
        
        if (parkingId === id && parkingType === "tandem" && linkedId) {
          // Found tandem parking, add its linked pair
          if (!allIds.includes(linkedId)) {
            allIds.push(linkedId);
          }
        }
      }
    });
    
    // Update cell if new IDs were added
    const newValue = allIds.join(",");
    if (newValue !== range.getValue()) {
      range.setValue(newValue);
    }
  }
}
```

4. Save script

**How it works**:
- Monitors edits to parking_spaces column (column H) in Owners/Tenants sheets
- Parses comma-separated parking IDs
- For each ID, checks Parking table:
  - If type = "tandem" and has linked_id → adds linked_id to list
- Updates cell with expanded list

**Example**:
- User types: `P-001,P-003`
- P-003 is tandem, linked to P-004
- Script auto-updates to: `P-001,P-003,P-004`

**Note**: If you implement Option 2 (Multi-Select Dropdown), combine both scripts into one `onEdit` function.

---

## Preventing Duplicate Parking IDs

### Challenge

Each parking space should appear at most once:
- In Parking table: parking_id must be unique
- In Parking table: linked_id must be unique (no parking can be linked to multiple others)
- In Owners/Tenants: Same parking shouldn't be assigned to multiple people

### Solution 1: Data Validation for linked_id

Already covered in Step 3: Parking sheet setup.

Custom formula in Column C:
```
=COUNTIF($C:$C, C2)<=1
```

This rejects duplicate linked_id values.

### Solution 2: Apps Script Bidirectional Link Validation

**Setup**:

1. In Apps Script: Create `ValidateLinkedParking.gs`
2. Paste this code:

```javascript
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  if (sheet.getName() !== "Parking") return;
  
  const range = e.range;
  
  // Only validate linked_id column (column C)
  if (range.getColumn() === 3) {
    const linkedId = range.getValue();
    if (!linkedId) return; // Empty is allowed
    
    const parkingId = range.offset(0, -2).getValue(); // Column A (parking_id)
    const parkingSheet = e.source.getSheetByName("Parking");
    const parkingData = parkingSheet.getDataRange().getValues();
    
    // Check if linked parking exists and links back
    let foundMatch = false;
    for (let i = 1; i < parkingData.length; i++) {
      if (parkingData[i][0] === linkedId) {
        if (parkingData[i][2] === parkingId) {
          foundMatch = true;
        } else {
          SpreadsheetApp.getUi().alert(
            '⚠️ Warning',
            `Linked parking ${linkedId} does not link back to ${parkingId}.\n\nPlease ensure tandem pairs link to each other:\n${parkingId} → ${linkedId}\n${linkedId} → ${parkingId}`,
            SpreadsheetApp.getUi().ButtonSet.OK
          );
        }
        break;
      }
    }
    
    if (!foundMatch && linkedId) {
      SpreadsheetApp.getUi().alert(
        '⚠️ Error',
        `Linked parking ${linkedId} not found or doesn't link back.`,
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    }
  }
}
```

3. Save script

**How it works**:
- Monitors edits to linked_id column (column C) in Parking sheet
- When user enters a linked_id:
  - Checks if that parking exists
  - Checks if it links back to the current parking
  - Shows warning if bidirectional link is missing

**Example**:
- P-003 sets linked_id = P-004
- Script checks: Does P-004 have linked_id = P-003?
- If no → shows warning
- If yes → validation passes

---

## Auto-Generated ID Fields Summary

### All *_id fields use the same formula pattern:

**parking_id** (Parking!A2):
```
=IF(B2<>"", "P-" & TEXT(ROW()-1, "000"), "")
```

**owner_id** (Owners!A2):
```
=IF(B2<>"", "OWN-" & TEXT(ROW()-1, "000"), "")
```

**tenant_id** (Tenants!A2):
```
=IF(B2<>"", "TEN-" & TEXT(ROW()-1, "000"), "")
```

**resident_id** (Residents!A2):
```
=IF(B2<>"", "R-" & TEXT(ROW()-1, "000"), "")
```

### How It Works

1. **Conditional Generation**: `IF(B2<>"", ...)` checks if adjacent column has data
   - Only generates ID if row is used
   - Empty rows remain empty
   
2. **Prefix**: `"P-"`, `"OWN-"`, `"TEN-"`, `"R-"` identifies record type

3. **Sequential Number**: `TEXT(ROW()-1, "000")` converts row number to 3-digit format
   - Row 2 → 001 (ROW()-1 = 1)
   - Row 3 → 002
   - Row 15 → 014
   
4. **Zero-Padding**: `"000"` format ensures leading zeros (001 instead of 1)

### Why This Works

- **Unique by Design**: Row number is unique, so ID is unique
- **No Duplicates**: Each row generates one ID based on its position
- **Auto-Fill**: Drag formula down once, works for all new rows
- **Read-Only**: Users can't accidentally change IDs (protected column)

### Setup Steps for Each Table

1. Enter formula in A2
2. Drag down to expected max rows (50-100)
3. Protect column A with warning prompt
4. Done — IDs generate automatically as users fill data

---

## Insert Sample Data

See separate file `docs/sample-data.md` for complete sample dataset including:
- 15 parking spaces (11 regular, 4 tandem in 2 pairs)
- 12 apartments with owners
- 4 apartments with tenants
- Residents table auto-generated from above

**Steps**:
1. Open `docs/sample-data.md`
2. Copy Parking data → paste into Parking sheet (starting row 2)
3. Copy Owners data → paste into Owners sheet (starting row 2)
4. Copy Tenants data → paste into Tenants sheet (starting row 2)
5. Residents sheet auto-populates via formulas (check that it works)

---

## Validation Checklist

After setup, verify:

- [ ] All 4 sheets created: Parking, Owners, Tenants, Residents
- [ ] Column headers match specification exactly
- [ ] Data validation dropdowns work:
  - [ ] Parking: type dropdown (regular/tandem/wheelchair)
  - [ ] Parking: linked_id dropdown from parking IDs
  - [ ] Owners/Tenants: phone validation rejects invalid formats
- [ ] Conditional formatting applied:
  - [ ] Tandem parking: yellow background
  - [ ] Wheelchair parking: light blue background
  - [ ] Tenant rows: light green background
- [ ] Auto-ID formulas work:
  - [ ] parking_id generates P-001, P-002, etc.
  - [ ] owner_id generates OWN-001, OWN-002, etc.
  - [ ] tenant_id generates TEN-001, TEN-002, etc.
  - [ ] resident_id generates R-001, R-002, etc.
- [ ] Residents table auto-populates from Owners/Tenants
- [ ] Column A protected in all sheets (warning prompt)
- [ ] Residents sheet protected (warning prompt)
- [ ] Sample data inserted and validated
- [ ] Apps Script project created (if using Option 2 or tandem auto-add)
- [ ] Spreadsheet ID saved for future API integration

---

## Troubleshooting

### Phone validation not working

**Symptom**: Phone numbers like `050-1234567` are rejected

**Fix**:
- Check regex formula: `=REGEXMATCH(E2,"^(\+972-)?05[0-9]-[0-9]{7}$")`
- Verify cell E2 reference matches your phone column
- Test formats: `050-1234567` ✓ or `+972-50-1234567` ✓
- Invalid formats: `0501234567` ✗ (missing dash), `+97250-1234567` ✗ (wrong format)

### Conditional formatting not applying

**Symptom**: Tandem parking not highlighted yellow

**Fix**:
- Check range includes data rows (e.g., A2:C100)
- Verify custom formula: `=$B2="tandem"` (absolute column $B, relative row 2)
- Ensure no extra spaces in dropdown values ("tandem " ≠ "tandem")

### Residents table empty or shows errors

**Symptom**: Residents sheet shows #REF!, #N/A, or empty cells

**Fix**:
- Check formula in B2: `=UNIQUE(SORT(FILTER({Owners!B:B;Tenants!B:B}, LEN({Owners!B:B;Tenants!B:B})>0)))`
- Verify sheet names are exact: "Owners", "Tenants" (case-sensitive)
- Ensure Owners and Tenants have data in column B (apartment)
- Check VLOOKUP formulas reference correct columns (B:C, B:D, etc.)

### Auto-ID not generating

**Symptom**: Column A remains blank even when data is entered

**Fix**:
- Check formula in A2: `=IF(B2<>"", "P-" & TEXT(ROW()-1, "000"), "")`
- Verify column B has data (formula only works if adjacent column filled)
- Drag formula down from A2 to cover all rows
- If still broken, re-enter formula manually in A2 and drag down

### Tandem auto-add not working

**Symptom**: Selecting P-003 doesn't auto-add P-004

**Fix**:
- Check Apps Script is saved and authorized
- Verify onEdit trigger exists: Apps Script > Triggers (clock icon)
- Test manually: Edit a cell in Owners!H2, check if script runs
- Check script logs: Apps Script > Executions for errors
- Verify Parking sheet has tandem type and linked_id set correctly

### Duplicate parking in assignments

**Symptom**: P-005 assigned to two different owners/tenants

**Fix**:
- For MVP: Manual admin review (check Owners and Tenants sheets visually)
- For production: Add Apps Script validation to check parking_spaces across both tables
- Use Conditional Formatting to highlight duplicates:
  - Range: Owners!H:H and Tenants!H:H
  - Custom formula: `=COUNTIF(Owners!$H:$H,H2)+COUNTIF(Tenants!$H:$H,H2)>1`
  - Format: Red background

---

## Next Steps

1. ✅ Complete this setup guide
2. ✅ Create simplified sample data (`docs/sample-data.md`)
3. Insert sample data into Google Sheets
4. Test all formulas and validations
5. Test Apps Script functions (if using Option 2 or tandem auto-add)
6. Begin planning mobile web interface

---

## Security Notes

- Never share spreadsheet publicly (keep private)
- Use Apps Script web app deployment with authentication (future phase)
- Regularly backup spreadsheet: File > Make a copy
- Limit edit access to building administrator only
- Read-only access for API (Google Apps Script service account)

---

## Reference Links

- [Google Sheets Functions](https://support.google.com/docs/table/25273)
- [Data Validation Guide](https://support.google.com/docs/answer/186103)
- [Apps Script Documentation](https://developers.google.com/apps-script)
- [VLOOKUP Tutorial](https://support.google.com/docs/answer/3093318)
- [Conditional Formatting](https://support.google.com/docs/answer/78413)
