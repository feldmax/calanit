# Development Plan - Calanit Project

## Project Vision

MVP web application for short-term parking space rental between neighbors in a 36-apartment residential building.

## Core Requirements

### Scope
- 36 apartments
- Each apartment: 1 storage room + 1-2 parking spaces
- 2-3 common parking spaces (building-owned)
- **MVP Focus**: Parking only (storage rooms - future phase)
- Rental types:
  - **Hourly**: 1 hour min, 24 hours max
  - **Daily**: 1 day min, 1 month max
  - **Monthly**: 1 month min, 1 year max

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

### Data Model (preliminary)

**Sheet 1: Apartments**
- apartment_number
- owner_name_1, owner_phone_1
- owner_name_2, owner_phone_2
- tenant_name_1, tenant_phone_1
- tenant_name_2, tenant_phone_2
- lease_start_date
- lease_end_date

**Sheet 2: Parking Spaces**
- parking_number
- apartment_number (owner)
- type (private/common)
- current_holder_phone (owner or tenant)

**Sheet 3: Storage Rooms**
- storage_number
- apartment_number (owner)
- current_holder_phone

**Sheet 4: Availability**
- resource_id (parking_number or storage_number)
- resource_type (parking/storage)
- available_from (datetime)
- available_to (datetime)
- rental_type (hourly/daily/monthly)
- owner_phone

**Sheet 5: Bookings**
- booking_id
- resource_id
- resource_type
- renter_phone
- booking_start
- booking_end
- status (pending/confirmed/cancelled)
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

## Open Questions ✅ RESOLVED

1. ✅ **UI Language**: English interface
2. ✅ **Priority**: Parking only for MVP (storage rooms - future)
3. **Google Sheets**: Should we create a template with sample data?
4. ✅ **Phone validation**: Israeli format 050-1234567 (simple format check)
5. ✅ **Timezone**: Jerusalem (Asia/Jerusalem)
6. ✅ **Booking limits**:
   - Hourly: 1h - 24h
   - Daily: 1 day - 1 month
   - Monthly: 1 month - 1 year
7. **Booking conflicts**: Auto-block or allow overbooking with manual resolution?

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
