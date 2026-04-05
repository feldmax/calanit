# Google Sheets Setup Guide

## Overview

Step-by-step instructions for creating the Calanit parking management database in Google Sheets.

**Important**: This database structure supports multiple buildings with detailed parking types and automated conflict resolution.

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
4. **Holders** (add new sheet - auto-generated)
5. **Availability** (add new sheet)
6. **Bookings** (add new sheet)
7. **Users_Registry** (add new sheet - auto-generated)

---

## Step 3: Setup Parking Sheet

### Column Headers (Row 1):
```
parking_number | type | linked_parking_number | ownership | street_address | location_description | status | notes
```

### Data Validation Setup:

**Column B (type)** - Dropdown list:
- Data > Data validation > List from a range
- Values: `regular, limited_access, premium, disabled, linked`

**Column D (ownership)** - Dropdown list:
- Values: `private, common`

**Column G (status)** - Dropdown list:
- Values: `active, maintenance`

### Conditional Formatting:

1. **Linked parking** (yellow):
   - Range: A2:H
   - Condition: Custom formula `=$B2="linked"`
   - Format: Light yellow background

2. **Common parking** (green):
   - Range: A2:H
   - Condition: Custom formula `=$D2="common"`
   - Format: Light green background

3. **Maintenance** (red):
   - Range: A2:H
   - Condition: Custom formula `=$G2="maintenance"`
   - Format: Light red background

---

## Step 4: Setup Owners Sheet

### Column Headers:
```
owner_id | first_name | family_name | phone | email | street_address | apartment | storage | parking_spaces | is_resident
```

### Data Validation Setup:

**Column D (phone)** - Format validation:
- Data > Data validation > Custom formula
- Formula: `=REGEXMATCH(D2,"^(\+972-)?05[0-9]-[0-9]{7}$")`
- Reject input if invalid

**Column E (email)** - Email validation (optional):
- Data > Data validation > Text > Email

**Column J (is_resident)** - Checkbox:
- Data > Data validation > Checkbox

### Conditional Formatting:

1. **Non-resident owners** (light blue):
   - Range: A2:J
   - Condition: Custom formula `=$J2=FALSE`
   - Format: Light blue background

### Formula for owner_id (Column A):

Cell A2:
```
="OWN-" & TEXT(ROW()-1, "000")
```
Drag down to auto-generate OWN-001, OWN-002, etc.

---

## Step 5: Setup Tenants Sheet

### Column Headers:
```
tenant_id | first_name | family_name | phone | email | street_address | apartment | storage | parking_spaces | rent_from | rent_until
```

### Data Validation Setup:

**Column D (phone)** - Same as Owners sheet:
```
=REGEXMATCH(D2,"^(\+972-)?05[0-9]-[0-9]{7}$")
```

**Column E (email)** - Email validation

**Columns J & K (dates)** - DateTime format:
- Format > Number > Custom: `yyyy-mm-dd hh:mm:ss`

### Conditional Formatting:

1. **Expiring soon** (< 30 days, orange):
   - Range: A2:K
   - Condition: Custom formula `=AND($K2<>"", $K2-TODAY()<=30, $K2>TODAY())`
   - Format: Light orange background

2. **Expired leases** (red):
   - Range: A2:K
   - Condition: Custom formula `=AND($K2<>"", $K2<TODAY())`
   - Format: Light red background

3. **Non-resident tenants** (no apartment, light purple):
   - Range: A2:K
   - Condition: Custom formula `=$G2=""`
   - Format: Light purple background

### Formula for tenant_id (Column A):

Cell A2:
```
="TEN-" & TEXT(ROW()-1, "000")
```

---

## Step 6: Setup Holders Sheet (Auto-Generated)

**⚠️ IMPORTANT**: This sheet is auto-populated via formulas. Do not edit manually.

### Column Headers:
```
holder_id | street_address_apartment | full_name | holder_type | phone | storage | parking_spaces
```

### Formulas:

**Cell A2** (holder_id):
```
="H-" & TEXT(ROW()-1, "000")
```

**Cell B2** (street_address_apartment):
This requires complex logic merging Owners and Tenants. Use QUERY or manual Apps Script sync.

**Simplified approach for MVP**: Admin manually copies relevant holders from Owners/Tenants after each update.

**Future enhancement**: Google Apps Script function to regenerate this table daily.

---

## Step 7: Setup Availability Sheet

### Column Headers:
```
availability_id | resource_type | resource_number | owner_phone | available_from | available_to | status | created_at | updated_at
```

### Data Validation Setup:

**Column B (resource_type)** - Dropdown:
- Values: `parking, storage`
- For MVP: only `parking`

**Column G (status)** - Dropdown:
- Values: `available, booked, cancelled, expired`

**Columns E, F, H, I (datetime)** - Custom format:
- Format > Number > Custom: `yyyy-mm-dd"T"hh:mm:ss"+03:00"`

### Conditional Formatting:

1. **Expired** (grey):
   - Condition: `=$G2="expired"`
   - Format: Grey background

2. **Booked** (yellow):
   - Condition: `=$G2="booked"`
   - Format: Yellow background

---

## Step 8: Setup Bookings Sheet

### Column Headers:
```
booking_id | availability_id | resource_type | resource_number | renter_phone | renter_name | booking_start | booking_end | status | created_at | updated_at | cancelled_at | cancellation_reason
```

### Data Validation Setup:

**Column C (resource_type)** - Dropdown:
- Values: `parking, storage`

**Column I (status)** - Dropdown:
- Values: `pending, confirmed, active, completed, cancelled`

### Conditional Formatting:

1. **Confirmed** (light green):
   - Condition: `=$I2="confirmed"`

2. **Active** (green):
   - Condition: `=$I2="active"`

3. **Completed** (grey):
   - Condition: `=$I2="completed"`

4. **Cancelled** (red):
   - Condition: `=$I2="cancelled"`

---

## Step 9: Setup Users_Registry Sheet (Auto-Generated)

**⚠️ Auto-synced from Owners/Tenants tables via Apps Script.**

### Column Headers:
```
phone | full_name | street_address | apartment | role | is_active | registered_at | last_login
```

### Data Validation Setup:

**Column E (role)** - Dropdown:
- Values: `owner, tenant, admin`

**Column F (is_active)** - Checkbox

---

## Step 10: Insert Sample Data

See separate file `docs/sample-data.md` for complete sample dataset including:
- 2 buildings (HaNassi 15, HaNassi 17)
- 36 apartments
- 40 parking spaces (all 5 types)
- 25+ owners/tenants
- 5 availability listings
- 4 bookings (various statuses)

---

## Step 11: Protect Sheets

1. Select Parking sheet
2. Data > Protect sheets and ranges
3. Set permissions: "Only you" (admin)
4. Repeat for Owners, Tenants sheets

**Do not protect**: Availability, Bookings, Users_Registry (Apps Script needs write access)

---

## Step 12: Get Spreadsheet ID

1. Open spreadsheet
2. Copy URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
3. Extract `{SPREADSHEET_ID}` (long alphanumeric string)
4. Save for Apps Script configuration

Example:
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
                                     ^^^^^^^^^^^^^^^^^^^
                                     This is the ID
```

---

## Step 13: Create Apps Script Project

1. In spreadsheet: Extensions > Apps Script
2. Name project: **Calanit_API**
3. Create files:
   - `Code.gs` - main API endpoints
   - `Auth.gs` - authentication logic
   - `Validation.gs` - booking conflict checks
   - `Triggers.gs` - scheduled maintenance tasks

See `docs/apps-script-api.md` for complete code (to be created).

---

## Step 14: Setup Time-Driven Triggers

In Apps Script editor:

1. Click clock icon (Triggers)
2. Add trigger: `dailyMaintenance` function
3. Time-based trigger
4. Day timer: 12 AM to 1 AM
5. Save

**Trigger functions**:
- Expire old availability records
- Update booking status (active → completed)
- Sync Users_Registry
- Regenerate Holders table

---

## Validation Checklist

After setup, verify:

- [ ] All 7 sheets created with correct names
- [ ] Column headers match specification exactly
- [ ] Data validation dropdowns work
- [ ] Phone number validation rejects invalid formats
- [ ] Conditional formatting applied (colors work)
- [ ] Sample data inserted
- [ ] Spreadsheet ID saved
- [ ] Apps Script project created
- [ ] Time-driven trigger configured
- [ ] Sheet protection enabled for admin tables

---

## Maintenance Guidelines

### Weekly Admin Tasks:
- Review Tenants sheet for expiring leases (orange highlights)
- Update rent_until dates as needed
- Check Parking sheet for maintenance status

### Monthly Admin Tasks:
- Verify Holders table is accurate (or re-sync via Apps Script)
- Review Users_Registry for inactive accounts
- Check for booking conflicts or anomalies

### As-Needed Tasks:
- Add new owners when apartments sold
- Add new tenants when leases signed
- Update parking status (active ↔ maintenance)
- Manually resolve booking disputes

---

## Troubleshooting

### Phone validation not working:
- Check regex formula: `^(\+972-)?05[0-9]-[0-9]{7}$`
- Verify format: `050-1234567` or `+972-50-1234567`

### Conditional formatting not applying:
- Check range includes all data rows
- Verify custom formula references correct columns (absolute column, relative row: `$B2`)

### Holders table empty:
- For MVP: manually copy relevant records from Owners/Tenants
- For production: implement Apps Script sync function

### Apps Script errors:
- Check spreadsheet ID in script properties
- Verify sheet names match exactly (case-sensitive)
- Check Apps Script execution logs

---

## Next Steps

1. ✅ Complete this setup guide
2. Create sample data file (`docs/sample-data.md`)
3. Develop Google Apps Script API
4. Test API endpoints with sample data
5. Build frontend interface

---

## Security Notes

- Never share spreadsheet publicly
- Use Apps Script web app deployment with authentication
- Regularly backup spreadsheet (File > Make a copy)
- Monitor Apps Script execution logs for suspicious activity
- Limit Users_Registry admin role to 1-2 building managers only

---

## Reference Links

- [Google Sheets Functions](https://support.google.com/docs/table/25273)
- [Data Validation Guide](https://support.google.com/docs/answer/186103)
- [Apps Script Documentation](https://developers.google.com/apps-script)
- [Time-Driven Triggers](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers)
