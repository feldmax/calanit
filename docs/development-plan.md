# Development Plan - Calanit Project

## Project Vision

MVP web application for short-term parking space rental between neighbors in a 36-apartment residential building.

## Core Requirements

### Scope
- 36 apartments across 1-2 buildings
- Each apartment: 1 storage room + 1-2 parking spaces
- 2-4 common parking spaces (building-owned)
- **MVP Focus**: Parking only (storage rooms - future phase)
- **5 Parking Types**:
  - Regular (majority)
  - Limited access (harder to park, e.g., last in row)
  - Premium (better access)
  - Disabled (expanded space)
  - Linked (tandem pairs - must book together)
- **Rental Model**:
  - **Hourly slots only**: 1 hour minimum, 48 hours maximum
  - No daily/monthly options for MVP
  - Bookings must start/end at exact hour marks (e.g., 14:00, 15:00)
- **Booking Rules**:
  - Auto-block overlapping bookings
  - Max 2 parking spaces per person simultaneously
  - Linked parking pairs must be booked together

### User Roles
1. **Administrator** (building manager)
   - Maintains Google Sheets database
   - Manages residents/owners/tenants data
   - Has access to all data

2. **Regular Users** (residents/owners/tenants)
   - Search available parking/storage
   - Book available spaces
   - List their spaces for rent
   - View their bookings

### Authentication
- Phone number verification only
- Israeli mobile format: 050-1234567 (10 digits with dash after prefix)
- Check against admin's Google Sheets registry
- No registration process for MVP
- Timezone: Jerusalem (Asia/Jerusalem)

### Monetization
- **None** for MVP
- Free subrental by mutual agreement
- Payment integration - future consideration

## Technical Architecture

### Frontend
- **Technology**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Hosting**: GitHub Pages
- **Design**: Mobile-first responsive design
- **Language**: English UI

### Backend
- **Database**: Google Sheets (admin's account)
- **API**: Google Apps Script deployed as web app
- **Authentication**: Phone number validation via Apps Script

### Data Model

**Admin Tables (manual entry):**

**Table 1: Parking**
- parking_number, type (5 types), linked_parking_number
- ownership (private/common), street_address
- location_description, status, notes

**Table 2: Owners**
- owner_id, first_name, family_name, phone, email
- street_address, apartment (can be multiple)
- storage, parking_spaces (comma-separated)
- is_resident (TRUE if lives there)

**Table 3: Tenants**
- tenant_id, first_name, family_name, phone, email
- street_address, apartment, storage, parking_spaces
- rent_from, rent_until (datetime)

**Table 4: Holders (auto-generated via formulas)**
- holder_id, street_address_apartment, full_name
- holder_type (owner/tenant), phone
- storage, parking_spaces

**Application Tables (managed by Apps Script):**

**Table 5: Availability**
- availability_id, resource_type, resource_number
- owner_phone, available_from, available_to
- status, created_at, updated_at

**Table 6: Bookings**
- booking_id, availability_id, resource_type, resource_number
- renter_phone, renter_name, booking_start, booking_end
- status, created_at, updated_at, cancelled_at, cancellation_reason

**Table 7: Users_Registry (auto-synced from Owners/Tenants)**
- phone, full_name, street_address, apartment
- role (owner/tenant/admin), is_active
- registered_at, last_login
- created_at

## Development Phases

### Phase 1: Project Setup ✅
- [x] Repository structure
- [x] CLAUDE.md instructions
- [x] Initial documentation
- [ ] Logging system setup

### Phase 2: Database Design
- [ ] Finalize Google Sheets structure
- [ ] Create sample data
- [ ] Document data validation rules

### Phase 3: Backend (Google Apps Script)
- [ ] Authentication endpoint
- [ ] Get available parking/storage
- [ ] Create booking
- [ ] List user's bookings
- [ ] Update availability
- [ ] CORS configuration

### Phase 4: Frontend - Core Features
- [ ] Authentication page
- [ ] Main dashboard
- [ ] Search available spaces
- [ ] Booking form
- [ ] My bookings view

### Phase 5: Frontend - Additional Features
- [ ] List my spaces for rent
- [ ] Manage availability
- [ ] Booking history
- [ ] Cancel booking

### Phase 6: Testing & Deployment
- [ ] Manual testing
- [ ] Deploy to GitHub Pages
- [ ] Configure Google Apps Script web app
- [ ] User acceptance testing

### Phase 7: Documentation
- [ ] User guide (for residents)
- [ ] Admin guide (for building manager)
- [ ] Setup instructions

## Success Criteria (MVP)

1. Admin can maintain resident database in Google Sheets
2. Users can authenticate with phone number
3. Users can see available parking spaces
4. Users can book parking for specific date/time
5. Users can list their parking as available
6. Users can view their active bookings
7. Mobile-friendly interface

## Out of Scope (MVP)

- Payment processing
- Push notifications
- Native mobile apps
- Storage room functionality (focus on parking first)
- Calendar integration
- Automated reminders
- Reviews/ratings

## Open Questions ✅ ALL RESOLVED

1. ✅ **UI Language**: English interface
2. ✅ **Priority**: Parking only for MVP (storage rooms - future)
3. ✅ **Google Sheets**: Sample data to be created with 2 buildings, 5 parking types
4. ✅ **Phone validation**: Israeli format 050-1234567 or +972-50-1234567
5. ✅ **Timezone**: Jerusalem (Asia/Jerusalem)
6. ✅ **Booking model**: Hourly slots only (1h min - 48h max)
7. ✅ **Booking conflicts**: Auto-block overlapping bookings
8. ✅ **Booking limits**: Max 2 parking spaces per person simultaneously
9. ✅ **Parking types**: 5 types including linked pairs (must book together)
10. ✅ **Data structure**: Separate first_name/family_name, separate street_address/apartment

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Google Sheets API limits | High | Cache data, implement rate limiting |
| Phone number conflicts | Medium | Clear validation rules, admin oversight |
| Concurrent booking conflicts | High | Implement locking mechanism in Apps Script |
| Google Apps Script quotas | Medium | Monitor usage, optimize queries |
| CORS issues | Medium | Proper Apps Script deployment settings |

## Next Steps

1. Confirm UI language preference
2. Set up logging system
3. Create Google Sheets template
4. Start with authentication flow
