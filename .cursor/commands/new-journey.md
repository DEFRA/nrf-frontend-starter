---
name: new-journey
description: Create a new Defra Forms journey from specification
parameters:
  - name: prompt
    description: Path to markdown file with journey specification (can be phased or full)
    required: true
  - name: phase
    description: 'Optional: Phase number for phased implementation (e.g. "1" for Phase 1)'
    required: false
---

# Create New Defra Forms Journey

## 🚨 STOP - READ THIS FIRST 🚨

**YOU MUST READ [`docs/DEFRA_FORMS.md`](../../docs/DEFRA_FORMS.md) BEFORE CREATING ANY FORM.**

The documentation contains THE 7 CRITICAL RULES that MUST be followed. Failing to follow these rules will result in:

- ❌ 500 errors on page load
- ❌ Broken conditional routing
- ❌ Pages showing when they shouldn't
- ❌ Forms that don't work at all

**Go read it now. This is not optional.**

---

## 📋 PHASED vs FULL Implementation

### Is this a PHASED prompt?

Check if the prompt file name contains "phased" or if the prompt has a "PHASE X" section.

**If YES - This is a PHASED implementation:**

- ✅ You MUST stop after completing the specified phase
- ✅ You MUST show the user what you built
- ✅ You MUST ask for approval before proceeding to next phase
- ✅ DO NOT build pages from future phases
- ✅ Use the `phase` parameter to know which phase to build

**Example phased prompts:**

- `prompts/nrf-estimate-journey-phased.md` - Build only the phase specified

**If NO - This is a FULL implementation:**

- Build all pages at once (only for simple journeys <10 pages)
- Still test incrementally as you build

---

## Pre-Implementation Checklist

Complete ALL of these steps BEFORE writing any code:

### Step 1: Read Documentation (REQUIRED)

- [ ] ✅ Read **ALL 7 CRITICAL RULES** in [`docs/DEFRA_FORMS.md`](../../docs/DEFRA_FORMS.md)
- [ ] ✅ Review working examples in `src/server/form-examples/`

### Step 2: Read and Analyze Spec

- [ ] Read the spec file at `{prompt}`
- [ ] Count total pages needed (including summary)
- [ ] Identify ALL pages that need unique IDs
- [ ] Identify if conditional routing is needed

### Step 3: Generate UUIDs

- [ ] Generate UUIDs: `node -e "for(let i=0; i<20; i++) console.log(require('crypto').randomUUID())"`
- [ ] Create IDS object with ONE UNIQUE ID PER PAGE (see [Rule 1](../../docs/DEFRA_FORMS.md))
- [ ] Verify no duplicate IDs exist

---

## Implementation Steps

### 1. Create IDS Object (FIRST!)

**See [DEFRA_FORMS.md - IDS Object Structure](../../docs/DEFRA_FORMS.md) for complete details.**

Generate UUIDs first, then create your IDS object with unique IDs for:

- Every page
- Every component (used in forms or conditions)
- Every list and list item
- Every condition and condition item

### 2. Create Service File (INCREMENTAL APPROACH)

**IMPORTANT: Build and test incrementally. Don't create all pages at once.**

#### Recommended Build Order:

1. **Start with 1-2 pages** (start page + one question page)
2. **Test those pages work**
3. **Add next page**
4. **Test again**
5. **Repeat until all pages done**

This way, if something breaks, you know it's the page you just added.

#### Create `src/server/form-examples/{slug}-service.js`:

**See [DEFRA_FORMS.md - Complete Service Template](../../docs/DEFRA_FORMS.md) for the full template.**

Key structure:

1. Import Boom
2. Create IDS object (all UUIDs)
3. Define metadata (id, slug, title, etc.)
4. Define definition (pages, conditions, lists, sections)
5. Implement services (formsService, outputService, formSubmissionService)
6. **Export as array**: `export default [{ ... }]` (see [Rule 3](../../docs/DEFRA_FORMS.md))

**Critical reminders:**

- **Rule 1**: Every page needs unique ID
- **Rule 4**: Conditional pages need condition in BOTH `next` array AND on page
- **Rule 5**: List items need IDs for conditional routing
- **Rule 6**: Paths should NOT include slug prefix

### 3. Register in server.js

In `src/server/server.js`:

```javascript
import {slugCamelCase}Services from './form-examples/{slug}-service.js'

// Add to allServices array
const allServices = [
  ...helloWorldServices,
  ...{slugCamelCase}Services  // ✅ Add new service
]
```

### 4. Add to Home Page

In `src/server/home/index.njk`, add table row:

```html
<tr class="govuk-table__row">
  <td class="govuk-table__cell">
    <a href="/{slug}/{first-page-path}" class="govuk-link">{Form Title}</a>
  </td>
  <td class="govuk-table__cell">{Description}</td>
</tr>
```

### 5. Verify Each Page (CRITICAL!)

**Before proceeding to the next page, verify the current page works correctly.**

#### Start the Server

```bash
npm run dev
```

#### Test EACH Page Individually

**For EVERY page in your form:**

1. **Navigate to the page** (use direct URL or click through form)
2. **Check for errors:**
   - [ ] ✅ Page loads without 500 error
   - [ ] ✅ No console errors in browser DevTools
   - [ ] ✅ No server errors in terminal
3. **Verify page content:**
   - [ ] ✅ Title displays correctly
   - [ ] ✅ All form fields appear
   - [ ] ✅ Hint text shows (if applicable)
   - [ ] ✅ Back link works (if applicable)
4. **Test validation:**
   - [ ] ✅ Submit empty form - error message appears
   - [ ] ✅ Error message text matches spec
   - [ ] ✅ Error summary displays at top
5. **Test navigation:**
   - [ ] ✅ Submit valid data - goes to correct next page
   - [ ] ✅ Back button returns to previous page

**Conditional Routing Pages (if applicable):**

For pages with conditional routing:

6. **Test each branch:**
   - [ ] ✅ Select option A - goes to correct page A
   - [ ] ✅ Go back, select option B - goes to correct page B
   - [ ] ✅ Conditional pages only show when condition met
   - [ ] ✅ Can't access conditional page by direct URL when condition not met

**Summary Page:**

7. **Check your answers page:**
   - [ ] ✅ All entered data displays correctly
   - [ ] ✅ Conditional data only shows when relevant
   - [ ] ✅ Change links go to correct pages
   - [ ] ✅ After changing, returns to summary with updated data

**Confirmation Page:**

8. **After submission:**
   - [ ] ✅ Confirmation page displays
   - [ ] ✅ Reference number shows
   - [ ] ✅ "What happens next" content displays

#### If ANY Test Fails

**STOP IMMEDIATELY. DO NOT CONTINUE.**

1. Check server terminal for error messages
2. Check browser console for JavaScript errors
3. Review the page definition in your service file
4. Common issues:
   - Duplicate page IDs (check IDS object)
   - Missing condition property on conditional pages
   - Wrong component type or missing required fields
   - Invalid UUID format
5. Fix the issue and re-test from Step 1

#### Example Test Session

```bash
# Terminal 1: Start server
npm run dev

# Terminal 2: While server runs, check each page
# Visit: http://localhost:3000
# Click form link
# For each page:
#   1. Load page - check for 500 errors
#   2. Check browser console (F12) - no red errors
#   3. Try to submit empty - error shows
#   4. Fill form correctly - goes to next page
#   5. Repeat for next page
```

**DO NOT mark implementation complete until ALL pages pass ALL checks.**

---

## 🚨 CRITICAL: Verify Against the 7 Rules

Before marking complete, verify your code follows **ALL 7 CRITICAL RULES** in [`docs/DEFRA_FORMS.md`](../../docs/DEFRA_FORMS.md):

1. **Rule 1**: Every page has UNIQUE ID (no duplicates)
2. **Rule 2**: Static UUIDs only (never runtime generation)
3. **Rule 3**: Export as array `[{ ... }]`
4. **Rule 4**: Dual-condition pattern (in `next` AND on page)
5. **Rule 5**: List items have IDs (for conditional routing)
6. **Rule 6**: No slug in paths (engine adds it)
7. **Rule 7**: Valid UUIDs only (hex chars: 0-9, a-f)

**See [`docs/DEFRA_FORMS.md`](../../docs/DEFRA_FORMS.md) for examples and component types.**

---

## FINAL VERIFICATION CHECKLIST

**BEFORE marking this task as complete, verify ALL of these:**

### IDS Object Verification

- [ ] ✅ Every page has a UNIQUE ID (no duplicates!)
- [ ] ✅ All IDs are in the IDS object (not inline)
- [ ] ✅ All IDs are valid UUIDs (only 0-9, a-f)
- [ ] ✅ Count: Do you have IDs for:
  - [ ] Every page (including start and summary)
  - [ ] Every component used in conditions
  - [ ] Every list
  - [ ] Every list item
  - [ ] Every condition
  - [ ] Every condition item

### Pages Array Verification

- [ ] ✅ Every page uses `id: IDS.somePage` (from IDS object)
- [ ] ✅ No page paths include the slug (e.g., use `/start` not `/nrf-estimate/start`)
- [ ] ✅ Start page is a valid path in `definition.startPage`
- [ ] ✅ Summary page is last and has `controller: 'SummaryPageController'`

### Conditional Routing Verification (if applicable)

- [ ] ✅ List items have `id` field (from IDS object)
- [ ] ✅ Conditions are in the `conditions` array
- [ ] ✅ Condition IDs match between `conditions` array and `next` array
- [ ] ✅ Conditional pages have `condition: IDS.conditionName` property
- [ ] ✅ DUAL-CONDITION: Condition in `next` array AND on page itself

### Export Verification

- [ ] ✅ Export is an ARRAY: `export default [{ ... }]` (NOT an object)
- [ ] ✅ All three services exported: formsService, outputService, formSubmissionService

### Registration Verification

- [ ] ✅ Service imported in `src/server/server.js`
- [ ] ✅ Service added to `allServices` array
- [ ] ✅ Link added to home page table in `src/server/home/index.njk`

### Test Before Completing

- [ ] ✅ Server starts without errors: `npm run dev`
- [ ] ✅ Form appears on home page
- [ ] ✅ Can access first page without 500 error
- [ ] ✅ Can navigate through all pages
- [ ] ✅ Conditional routing works (if applicable)
- [ ] ✅ Can submit form and see confirmation

**If ANY checkbox is unchecked, DO NOT mark the task as complete. Fix the issues first.**

---

## 🛑 PHASE COMPLETION - FOR PHASED IMPLEMENTATIONS ONLY

**If you're working on a PHASED prompt (like nrf-estimate-journey-phased.md):**

### After Completing a Phase:

1. **✅ Verify the Phase Completion Checklist** (in the phased prompt file)

   - All pages in this phase built
   - All pages tested
   - All routing works
   - No errors

2. **📊 Report to User:**

   ```
   ✅ Phase [X] Complete!

   **What I built:**
   - Page 1: [Page name and path]
   - Page 2: [Page name and path]
   - Page 3: [Page name and path]

   **Routing:**
   - [Describe the flow through these pages]

   **How to test:**
   1. Visit: http://localhost:3000
   2. Click the form link
   3. [Step-by-step testing instructions]

   **Next phase:**
   Phase [X+1] will build: [List pages from next phase]
   ```

3. **⏸️ STOP AND WAIT FOR APPROVAL**

   Ask the user:

   ```
   "I've completed Phase [X]. Please test it and let me know if I should:
   1. Fix anything in this phase
   2. Proceed to Phase [X+1]
   3. Make adjustments before continuing"
   ```

4. **🚫 DO NOT PROCEED TO NEXT PHASE WITHOUT USER APPROVAL**
   - Don't build pages from future phases
   - Don't assume the user wants you to continue
   - Wait for explicit approval

### If User Approves Proceeding:

User will say something like:

- "Looks good, proceed to Phase 2"
- "Phase 1 tested and approved, continue"
- "Move to next phase"

Then you can start the next phase by:

1. Reading the next phase requirements from the phased prompt
2. Following the same process
3. Stopping again after that phase completes

### If User Wants Changes:

If user reports issues:

1. Fix the issues in the current phase
2. Re-test
3. Report again
4. Wait for approval again

**DO NOT skip ahead hoping to fix issues later. Fix them NOW.**

---

## If You Get Stuck

1. Check [`docs/DEFRA_FORMS.md`](../../docs/DEFRA_FORMS.md) - Complete reference
2. Review working examples in `src/server/form-examples/`
3. Official Defra Forms docs: https://defra.github.io/forms-engine-plugin/GETTING_STARTED.html
4. **Most common issue**: Duplicate page IDs (Rule 1) - check the IDS object
5. **Second most common**: Missing `condition` property on conditional pages (Rule 4)
