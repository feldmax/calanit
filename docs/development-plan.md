# Development Plan - Calanit Project

## Project Vision

MVP web application for short-term parking space rental between neighbors in a 36-apartment residential building.

## Core Requirements

### Scope
- **Single building only** (12 apartments for MVP)
- Each apartment: 1 storage room + 0-2 parking spaces
- **Private parking only** (no common/building-owned parking for MVP)
- **MVP Focus**: Display parking and resident lists only (no booking functionality yet)
- **3 Parking Types**:
  - Regular (majority)
  - Tandem (linked pairs - must be rented together)
  - Wheelchair (accessible parking - can add later)
- **Rental Model** (Future Phase):
  - Hourly slots: 1 hour minimum, 48 hours maximum
  - Bookings start/end at exact hour marks (e.g., 14:00, 15:00)
- **Booking Rules** (Future Phase):
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
- parking_id (auto-generated: P-001, P-002, etc.)
- type (regular, tandem, wheelchair)
- linked_id (for tandem pairs only)

**Table 2: Owners**
- owner_id (auto-generated: OWN-001, OWN-002, etc.)
- apartment, first_name, family_name, phone, email
- storage, parking_spaces (comma-separated)

**Table 3: Tenants**
- tenant_id (auto-generated: TEN-001, TEN-002, etc.)
- apartment, first_name, family_name, phone, email
- storage, parking_spaces (comma-separated)

**Table 4: Residents (auto-generated via formulas)**
- resident_id (auto-generated: R-001, R-002, etc.)
- apartment, first_name, family_name, phone, email
- storage, parking_spaces
- **Logic**: Prioritizes Tenants over Owners (current resident = tenant if apartment is rented, otherwise owner)

**MVP Scope**: Only 4 tables above. No Availability, Bookings, or Users_Registry tables for MVP.

## Development Phases

### Phase 1: Project Setup ✅
- [x] Repository structure
- [x] CLAUDE.md instructions
- [x] Initial documentation
- [ ] Logging system setup

### Phase 2: Database Design ✅ COMPLETED
- [x] Finalize Google Sheets structure (4 tables)
- [x] Create sample data (15 parking, 12 apartments, 4 tenants)
- [x] Document data validation rules
- [x] Document auto-generation formulas
- [x] Document Residents auto-population logic

### Phase 3: Google Sheets Setup (Current Phase)
- [ ] Create Google Sheets with 4 tables
- [ ] Set up auto-ID formulas (parking_id, owner_id, tenant_id, resident_id)
- [ ] Configure data validation (dropdowns, phone format)
- [ ] Set up conditional formatting (tandem yellow, wheelchair blue)
- [ ] Implement Residents auto-population formulas (VLOOKUP with IFERROR)
- [ ] Insert sample data for testing
- [ ] Test all formulas and validation rules

### Phase 4: Optional Apps Script Enhancements
- [ ] Multi-select dropdown with checkboxes (parking_spaces column)
- [ ] Tandem auto-add script (selecting P-004 auto-adds P-005)
- [ ] Bidirectional link validation (tandem pairs link to each other)
- [ ] Column protection (warning prompts for auto-generated IDs)

### Phase 5: Frontend - MVP Display (Next Phase)
- [ ] Basic HTML structure
- [ ] Display parking list (from Google Sheets API or Apps Script)
- [ ] Display residents list (from Google Sheets API or Apps Script)
- [ ] Mobile-first responsive CSS
- [ ] Simple navigation between views
- [ ] No authentication for MVP (public read-only display)

### Phase 6: Future Enhancements (Post-MVP)
- [ ] User authentication (phone number verification)
- [ ] Availability management (list my parking as available)
- [ ] Booking functionality (search, book, cancel)
- [ ] My bookings view
- [ ] Booking conflict detection
- [ ] Max 2 parking limit enforcement
- [ ] Push notifications
- [ ] Admin dashboard

### Phase 7: Testing & Deployment
- [ ] Manual testing with sample data
- [ ] Verify Residents auto-population works correctly
- [ ] Test on mobile devices (responsive design)
- [ ] Deploy to GitHub Pages
- [ ] Configure Google Sheets API access (read-only for frontend)
- [ ] User acceptance testing (building residents)

### Phase 8: Documentation
- [ ] User guide (for residents) - how to view parking/residents
- [ ] Admin guide (for building manager) - how to update Google Sheets
- [ ] Setup instructions (for other buildings wanting to use this)
- [ ] Future roadmap (booking features, authentication, etc.)

## Success Criteria (MVP)

1. Admin can maintain resident database in Google Sheets (4 tables)
2. Parking table with 3 types (regular, tandem, wheelchair)
3. Owners and Tenants tables with phone/email
4. Residents table auto-populates from Owners/Tenants with priority logic
5. Simple mobile web interface displays:
   - List of all parking spaces with types
   - List of current residents with contact info
6. Mobile-friendly, responsive design

**Out of MVP Scope** (Future Phases):
- User authentication
- Booking functionality
- Availability management
- Payment processing

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
3. ✅ **Google Sheets**: Single building, 4 tables, 3 parking types
4. ✅ **Phone validation**: Israeli format 050-1234567 or +972-50-1234567
5. ✅ **Timezone**: Jerusalem (Asia/Jerusalem)
6. ✅ **Booking model**: Hourly slots (future phase - MVP just displays data)
7. ✅ **Booking conflicts**: Auto-block overlapping (future phase)
8. ✅ **Booking limits**: Max 2 parking spaces (future phase)
9. ✅ **Parking types**: 3 types (regular, tandem, wheelchair)
10. ✅ **Data structure**: Separate first_name/family_name, 4 tables only for MVP
11. ✅ **MVP Scope**: Display parking list + residents list only (no booking yet)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Google Sheets API limits | High | Cache data, implement rate limiting |
| Phone number conflicts | Medium | Clear validation rules, admin oversight |
| Concurrent booking conflicts | High | Implement locking mechanism in Apps Script |
| Google Apps Script quotas | Medium | Monitor usage, optimize queries |
| CORS issues | Medium | Proper Apps Script deployment settings |

## Next Steps

1. ✅ Set up logging system
2. ✅ Create Google Sheets data model specification
3. ✅ Create sample data
4. → **Current**: Set up Google Sheets with formulas and sample data
5. Test Residents auto-population logic
6. Plan simple frontend for displaying parking + residents lists
