# NRF Estimate Journey - PHASED IMPLEMENTATION

**CRITICAL: This journey MUST be built in phases. DO NOT attempt to build all pages at once.**

## Implementation Strategy

This 19-page journey is too complex to build in one pass. It MUST be built in 5 phases, with testing and approval between each phase.

**After completing each phase:**
1. ✅ Test all pages in that phase
2. ✅ Verify all routing works
3. ✅ Show the user what you've built
4. ⏸️ **STOP and ask for approval before proceeding to next phase**

---

## PHASE 1: Core Journey Selection (3 pages)

**Goal:** Get the basic journey routing working

### Pages to Build:
1. **Start Page** (`/start`)
   - Title: "Get an estimate for the Nature Restoration Fund levy"
   - Add Html component with content about the service
   - Button: "Start now"
   - Next: `/what-would-you-like-to-do`

2. **Journey Selection** (`/what-would-you-like-to-do`)
   - RadiosField: "What would you like to do?"
   - Options:
     - "Get an estimate for the levy" (value: `estimate`)
     - "Make a payment for the levy" (value: `payment`)
   - Conditional routing:
     - If `estimate` → `/redline-map`
     - If `payment` → `/do-you-have-an-estimate-ref`

3. **Summary Page** (`/summary`)
   - SummaryPageController
   - Will show collected data (initially empty in this phase)

### Phase 1 Success Criteria:
- [ ] All 3 pages load without errors
- [ ] Start page shows content
- [ ] Journey selection page shows two radio options
- [ ] Selecting "estimate" would route to `/redline-map` (page doesn't exist yet, that's OK)
- [ ] Selecting "payment" would route to `/do-you-have-an-estimate-ref` (page doesn't exist yet, that's OK)
- [ ] Summary page loads (even if empty)

### ⏸️ STOP HERE - Show user what you've built and ask:
"Phase 1 complete. I've built the journey selection. Can you test it and approve before I continue to Phase 2?"

---

## PHASE 2: Boundary Collection (4 pages)

**Goal:** Get the site boundary data collection working

**Prerequisites:** Phase 1 must be complete and approved

### Pages to Build:

4. **Redline Boundary Question** (`/redline-map`)
   - RadiosField: "Do you have a red line boundary file for your development?"
   - Hint: "A red line boundary file is a geographic file..."
   - Options:
     - "Yes, I have a red line boundary file" (value: `yes`)
     - "No, I will enter the boundary another way" (value: `no`)
   - Conditional routing:
     - If `yes` → `/upload-redline`
     - If `no` → `/map`

5. **Upload Redline File** (`/upload-redline`)
   - **Controller:** FileUploadPageController
   - FileUploadField component
   - Accepts: .shp, .geojson
   - Max size: 2MB (configure with multer)
   - Conditional: Only shows if `hasRedlineBoundaryFile === 'yes'`
   - Next: `/map` (for confirmation)
   - **Implementation Notes:**
     - Use FileUploadPageController from DEFRA Forms
     - Configure multer with memory storage and 2MB limit
     - For GeoJSON files: Parse to extract coordinates
     - Store filename in `redlineFile` field
     - Store parsed coordinates in session (will be used by backend)
     - For .shp files: Show error "Shapefile parsing not yet supported. Please use GeoJSON."

6. **Define Boundary** (`/map`)
   - TextField: "Enter your development site boundary coordinates"
   - Hint: "Enter the center coordinates in format: longitude, latitude"
   - Example: "-0.4, 51.5"
   - Next: `/building-type`
   - Note: In production this would be an interactive map, but text input for now

7. **No EDP Area** (`/no-edp`) - TERMINAL PAGE
   - Html component with error message
   - "Your development is not in an Environmental Delivery Partner area"
   - No next page (terminal)

### Phase 2 Updates to Phase 1:
- Update journey selection page routing to point to `/redline-map` for estimate journey

### Phase 2 Success Criteria:
- [ ] Can navigate from journey selection to redline question
- [ ] Selecting "yes" routes to upload page
- [ ] Selecting "no" routes to map page
- [ ] Upload page shows file upload component
- [ ] Map page shows text input for coordinates
- [ ] Can enter coordinates and continue to building type page (will 404, that's OK)
- [ ] No EDP page shows error message

### ⏸️ STOP HERE - Show user what you've built and ask:
"Phase 2 complete. I've built boundary collection with file upload and manual entry. Can you test it and approve before I continue to Phase 3?"

---

## PHASE 3: Building Type Selection (3 pages)

**Goal:** Get building type selection and initial data collection working

**Prerequisites:** Phases 1 & 2 must be complete and approved

### Pages to Build:

8. **Select Building Types** (`/building-type`)
   - CheckboxesField: "What types of buildings are part of your development?"
   - Hint: "Select all that apply"
   - Options:
     - "Dwellinghouse"
     - "Hotel"
     - "House of multiple occupation (HMO)"
     - "Residential institution"
     - "Non-residential development"
   - Complex routing logic:
     - If "Non-residential" selected → `/non-residential` (terminal)
     - Else if any of [Hotel, HMO, Residential institution] → `/room-count`
     - Else if "Dwellinghouse" → `/residential`
     - Else → `/email`

9. **Non-Residential** (`/non-residential`) - TERMINAL PAGE
   - Html component: "Non-residential developments have different requirements"
   - "Contact your EDP directly"
   - No next page (terminal)

10. **Residential Count** (`/residential`)
    - NumberField: "How many dwellinghouse buildings?"
    - Min: 1
    - Conditional: Only if "Dwellinghouse" selected
    - Next: `/email`

### Phase 3 Updates to Phase 2:
- Update map page to route to `/building-type`

### Phase 3 Success Criteria:
- [ ] Building type page shows checkboxes for all 5 types
- [ ] Can select multiple building types
- [ ] Selecting "Non-residential" routes to terminal page
- [ ] Selecting "Dwellinghouse" routes to residential count page
- [ ] Residential count page accepts number input
- [ ] Non-residential terminal page shows message

### ⏸️ STOP HERE - Show user what you've built and ask:
"Phase 3 complete. I've built building type selection and residential count. Can you test it and approve before I continue to Phase 4?"

---

## PHASE 4: Room Count Iteration & Email (2 pages)

**Goal:** Get the multi-step room count collection working

**Prerequisites:** Phases 1, 2 & 3 must be complete and approved

### Pages to Build:

11. **Room Count** (`/room-count`) - MULTI-STEP PAGE
    - NumberField: "How many rooms are in your [building type]?"
    - This page ITERATES for each building type requiring room counts
    - Show progress: "Step X of Y"
    - Hints by type:
      - Hotel: "Enter the total number of guest rooms"
      - HMO: "Enter the total number of bedrooms available for rent"
      - Residential institution: "Enter the total number of resident rooms or beds"
    - Min: 1
    - Next: Either re-render for next type, or `/residential` or `/email`

12. **Email Address** (`/email`)
    - EmailAddressField: "What is your email address?"
    - Hint: "We'll send your estimate details to this email"
    - Next: `/summary`

### Phase 4 Implementation Notes:

**Room Count Iteration Logic:**
This page needs custom logic to iterate through building types. You'll need to:
1. Store `roomCountTypes` array in session (building types needing room counts)
2. Track `currentRoomCountIndex` in session
3. On page load: Show question for `roomCountTypes[currentRoomCountIndex]`
4. On submit: Store count, increment index
5. If more types remain: Re-render this page
6. If done: Route to next page based on journey

**The form definition will look like:**
```javascript
{
  title: 'How many rooms are in your [building type]?',
  path: '/room-count',
  components: [
    {
      type: 'NumberField',
      title: 'How many rooms?',
      name: 'roomCount',
      // ... validation
    }
  ],
  next: [{ path: '/residential' }], // Will be dynamic in controller
  id: IDS.roomCountPage
}
```

**Note:** This may require a custom page controller to handle the iteration logic. If the standard DEFRA Forms engine can't handle this, we may need to simplify to separate pages for each building type.

### Phase 4 Success Criteria:
- [ ] Room count page displays for Hotel (if selected in building types)
- [ ] Shows progress indicator (Step 1 of X)
- [ ] After entering count, shows next building type (if multiple selected)
- [ ] After all room counts collected, routes to email page
- [ ] Email page accepts email input with validation

### ⏸️ STOP HERE - Show user what you've built and ask:
"Phase 4 complete. I've built room count iteration and email collection. Can you test it and approve before I continue to Phase 5?"

---

## PHASE 5: Payment Journey Branch & Final Pages (7 pages)

**Goal:** Complete the payment journey branch and confirmation pages

**Prerequisites:** Phases 1, 2, 3 & 4 must be complete and approved

### Pages to Build:

13. **Do You Have Estimate Ref** (`/do-you-have-an-estimate-ref`)
    - RadiosField: "Do you have an estimate reference?"
    - Hint: "Reference number starting with EST-"
    - Options: "Yes" / "No"
    - Conditional routing:
      - If `yes` → `/enter-estimate-ref`
      - If `no` → `/redline-map` (joins estimate journey)
    - Conditional display: Only if `journeyType === 'payment'`

14. **Enter Estimate Ref** (`/enter-estimate-ref`)
    - TextField: "Enter your estimate reference"
    - Hint: "6-digit number starting with EST-, e.g. EST-123456"
    - Validation: Must be numeric
    - Next: `/retrieve-estimate-email`

15. **Retrieve Estimate Email** (`/retrieve-estimate-email`)
    - EmailAddressField: "Enter the email you used for your estimate"
    - Hint: "We'll send a link to your estimate"
    - Next: `/estimate-email-retrieval-content`

16. **Email Retrieval Content** (`/estimate-email-retrieval-content`)
    - Html component: "We've sent you an email"
    - Info about checking inbox and clicking link
    - Next: `/planning-ref`

17. **Planning Reference** (`/planning-ref`)
    - TextField: "What is the planning application reference?"
    - Hint: "e.g. PLAN/2024/001"
    - Conditional: Only for payment journey without estimate ref
    - Next: `/email` (if no email collected yet) or `/summary`

18. **Estimate Confirmation** (`/confirmation`)
    - Html component with panel showing estimate reference
    - "Your estimate reference is EST-XXXXXX"
    - "What happens next" content
    - Terminal page (form complete)

19. **Payment Confirmation** (`/payment-confirmation`)
    - Html component with panel showing payment reference
    - "Your payment reference is PAY-XXXXXX"
    - "What happens next" content
    - Terminal page (form complete)

### Phase 5 Updates to Previous Phases:
- Update journey selection routing for payment option
- Update summary page to conditionally render estimate vs payment template
- Update outputService to generate different references based on journey type

### Phase 5 Success Criteria:
- [ ] Payment journey flows from selection through estimate ref question
- [ ] Can enter estimate ref and email, get retrieval content
- [ ] Can skip estimate ref and go through full data collection
- [ ] Planning reference page shows for payment without estimate
- [ ] Summary page shows correct data based on journey taken
- [ ] Estimate confirmation shows with EST- reference
- [ ] Payment confirmation shows with PAY- reference

### ⏸️ STOP HERE - Show user what you've built and ask:
"Phase 5 complete. The full journey is now implemented. Can you test both estimate and payment flows end-to-end?"

---

## Testing Requirements Per Phase

### Phase 1 Testing:
```bash
npm run dev
# Visit: http://localhost:3000
# Click "Nature Restoration Fund Levy Estimate and Payment"
# Test:
# 1. Start page loads
# 2. Can click Continue
# 3. Journey selection page loads
# 4. Can select each option
# 5. Error shows if nothing selected
```

### Phase 2 Testing:
```bash
# From journey selection, select "Get an estimate"
# Test:
# 1. Redline question page loads
# 2. Selecting "Yes" → upload page appears
# 3. Selecting "No" → map page appears
# 4. Upload page has file input
# 5. Map page has text input for coordinates
# 6. Can enter coordinates and continue
```

### Phase 3 Testing:
```bash
# Continue from boundary collection
# Test:
# 1. Building type page loads with checkboxes
# 2. Can select multiple types
# 3. Selecting "Non-residential" → terminal page
# 4. Selecting "Dwellinghouse" → residential count page
# 5. Can enter number and continue
```

### Phase 4 Testing:
```bash
# Select Hotel + HMO in building types
# Test:
# 1. Room count page shows "Step 1 of 2"
# 2. Enter hotel rooms → shows "Step 2 of 2" for HMO
# 3. Enter HMO rooms → goes to email page
# 4. Email page accepts valid email
# 5. Invalid email shows error
```

### Phase 5 Testing:
```bash
# Test payment journey:
# From start, select "Make a payment"
# Test:
# 1. Do you have estimate ref → shows
# 2. Select "Yes" → enter ref page
# 3. Enter ref → email retrieval page
# 4. Complete flow → payment confirmation

# Test estimate journey:
# From start, select "Get estimate"
# Test:
# 1. Complete full flow
# 2. Summary shows all collected data
# 3. Submit → estimate confirmation with EST- reference
```

---

## CRITICAL RULES FOR EACH PHASE

### Before Starting Any Phase:

1. ✅ **Verify previous phase is complete**
   - All pages from previous phases work
   - All routing is correct
   - User has approved proceeding

2. ✅ **Read the phase requirements carefully**
   - Understand which pages to build
   - Understand the routing logic
   - Identify any conditional pages

3. ✅ **Plan the IDS object**
   - Generate UUIDs for ALL pages in this phase
   - Generate UUIDs for ALL components in this phase
   - Generate UUIDs for ALL lists/list items/conditions

### While Building a Phase:

4. ✅ **Build pages in order**
   - Don't skip ahead
   - Test each page as you add it
   - Fix errors before continuing

5. ✅ **Follow the 7 Critical Rules**
   - Unique page IDs
   - Static UUIDs
   - Export as array
   - Dual-condition pattern
   - List items have IDs
   - No slug in paths
   - Valid UUIDs

### After Completing a Phase:

6. ✅ **Test everything in this phase**
   - Every page loads
   - Every route works
   - Every validation works
   - No console errors

7. ✅ **STOP and get approval**
   - Show user what you built
   - Ask for approval to continue
   - Don't proceed to next phase without approval

---

## What to Do If You Get Stuck

### If a page won't load:
1. Check for duplicate page IDs in IDS object
2. Check browser console for errors
3. Check server terminal for errors
4. Verify the page path doesn't include the slug

### If conditional routing doesn't work:
1. Check condition is in conditions array
2. Check condition is in next array on parent page
3. Check conditional page has condition property
4. Verify list items have id field

### If you can't implement something:
1. **STOP**
2. Tell the user what you're stuck on
3. Ask for guidance
4. Don't try to work around it by skipping pages

---

## Phase Completion Checklist

After each phase, verify:

### Code Verification:
- [ ] All pages have unique IDs
- [ ] All IDs in IDS object
- [ ] Conditional pages have condition property
- [ ] List items have id field
- [ ] No slug in any path
- [ ] Export is an array

### Testing Verification:
- [ ] Server starts without errors
- [ ] All new pages load without 500 errors
- [ ] All new routes work correctly
- [ ] All validation shows correct errors
- [ ] No console errors in browser
- [ ] No errors in server terminal

### Approval Gate:
- [ ] User has tested this phase
- [ ] User has approved proceeding to next phase

**DO NOT proceed to next phase until user gives explicit approval.**

---

## Summary

**Total pages:** 19
**Total phases:** 5
**Approach:** Incremental with approval gates

| Phase | Pages | Approval Required |
|-------|-------|-------------------|
| 1 | 3 pages | ✅ Yes - before Phase 2 |
| 2 | 4 pages | ✅ Yes - before Phase 3 |
| 3 | 3 pages | ✅ Yes - before Phase 4 |
| 4 | 2 pages | ✅ Yes - before Phase 5 |
| 5 | 7 pages | ✅ Yes - final testing |

**This approach ensures:**
- Complex journey is manageable
- Errors are caught early
- User has visibility into progress
- Each phase is tested before continuing
- No "big bang" implementation that might fail
