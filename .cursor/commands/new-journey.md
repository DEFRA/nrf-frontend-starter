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
- [ ] ✅ Read ALL 7 critical rules in [`docs/DEFRA_FORMS.md`](../../docs/DEFRA_FORMS.md)
- [ ] ✅ Understand the duplicate page ID problem (Rule 1)
- [ ] ✅ Understand the dual-condition pattern (Rule 4)
- [ ] ✅ Review the working examples

### Step 2: Read and Analyze Spec
- [ ] Read the spec file at `{prompt}`
- [ ] Count total pages needed (including summary)
- [ ] Identify ALL pages that need unique IDs
- [ ] Identify if conditional routing is needed

### Step 3: Review Examples
- [ ] Review [`hello-world-service.js`](../../src/server/form-examples/hello-world-service.js) (simple form)
- [ ] Review [`conditional-routing-example-service.js`](../../src/server/form-examples/conditional-routing-example-service.js) (conditional routing)

### Step 4: Generate UUIDs
- [ ] Generate UUIDs: `node -e "for(let i=0; i<20; i++) console.log(require('crypto').randomUUID())"`
- [ ] Create IDS object with ONE UNIQUE ID PER PAGE
- [ ] Verify no duplicate IDs exist

---

## Implementation Steps

### 1. Create IDS Object (FIRST!)

```javascript
// Generate UUIDs in terminal first, then paste here
const IDS = {
  // Pages
  page1: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  page2: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  summaryPage: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',

  // Components
  component1: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',

  // Lists (if needed for RadiosField/CheckboxesField)
  list1: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',

  // List Items (if conditional routing)
  listItem1: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  listItem2: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',

  // Conditions (if conditional routing)
  condition1: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',

  // Condition Items (if conditional routing)
  conditionItem1: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
}
```

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

```javascript
import Boom from '@hapi/boom'

// 1. IDS object (from step 1)
const IDS = { /* ... */ }

// 2. Metadata
const now = new Date()
const user = { id: 'example-user', displayName: 'Example user' }
const author = { createdAt: now, createdBy: user, updatedAt: now, updatedBy: user }

const metadata = {
  id: '{form-id}',
  slug: '{form-slug}',
  title: '{Form Title from spec}',
  organisation: 'Defra',
  teamName: 'Example team',
  teamEmail: 'example-team@defra.gov.uk',
  submissionGuidance: 'Thanks for submitting your response',
  notificationEmail: 'example-email@defra.com',
  ...author,
  live: author
}

// 3. Definition
const definition = {
  name: '{Form Name}',
  engine: 'V2',
  schema: 2,
  startPage: '/first-page-path',
  pages: [
    // Create ALL pages from spec
    {
      title: '{Page Title}',
      path: '/page-path',  // NO slug prefix
      section: '{sectionName}',  // If using sections
      components: [
        {
          type: '{ComponentType}',  // TextField, RadiosField, etc
          title: '{Field Title}',
          name: '{fieldName}',
          hint: '{hint text}',  // Optional
          options: {
            required: true/false,
            list: IDS.listName  // Only for RadiosField/CheckboxesField/etc
          },
          schema: {
            error: {
              required: '{error message}'
            }
          },
          id: IDS.componentName  // ✅ From IDS object
        }
      ],
      next: [
        // Simple: { path: '/next-page' }
        // Conditional: { path: '/page-a', condition: IDS.condition1 }
      ],
      condition: IDS.conditionName,  // Only if this page is conditional
      id: IDS.pageName  // ✅ From IDS object
    },

    // Summary page (ALWAYS LAST)
    {
      title: 'Check your answers',
      path: '/check-your-answers',
      controller: 'SummaryPageController',
      components: [],
      next: [],
      id: IDS.summaryPage
    }
  ],

  // If conditional routing needed
  conditions: [
    {
      items: [{
        id: IDS.conditionItem1,
        componentId: IDS.componentName,
        operator: 'is',
        value: {
          itemId: IDS.listItem1,
          listId: IDS.listName
        },
        type: 'ListItemRef'
      }],
      displayName: 'Condition description',
      id: IDS.condition1
    }
  ],

  // If using RadiosField/CheckboxesField
  lists: [
    {
      name: '{listName}',
      title: '{List Title}',
      type: 'string',
      id: IDS.listName,
      items: [
        {
          id: IDS.listItem1,  // ✅ MUST have ID for ListItemRef
          text: 'Option 1',
          value: 'Option 1'
        }
      ]
    }
  ],

  // If using sections for summary page
  sections: [
    {
      name: '{sectionName}',
      title: '{Section Title}'
    }
  ]
}

// 4. Services
const formsService = {
  getFormMetadata: function (slug) {
    if (slug === metadata.slug) return Promise.resolve(metadata)
    throw Boom.notFound(`Form '${slug}' not found`)
  },
  getFormDefinition: function (id) {
    if (id === metadata.id) return Promise.resolve(definition)
    throw Boom.notFound(`Form '${id}' not found`)
  }
}

const outputService = {
  submit: async function (context, request, model, emailAddress, items, submitResponse) {
    const referenceNumber = `{PREFIX}-${Date.now()}`
    console.log('✅ Form submitted successfully!')
    console.log('Reference:', referenceNumber)
    console.log('Data:', items.map(i => ({ name: i.name, value: i.value })))

    return {
      title: '{Confirmation title}',
      content: `Your reference number is ${referenceNumber}`
    }
  }
}

const formSubmissionService = {
  submit: async function (payload, request) {
    const reference = `{PREFIX}-${Date.now()}`
    return {
      id: reference,
      reference,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      main: payload.main || []
    }
  },
  persistFiles: async function (context, request, model) {
    return Promise.resolve()
  }
}

// 5. Export as ARRAY
export default [{ formsService, outputService, formSubmissionService }]
```

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

## 🚨 THE 7 CRITICAL RULES 🚨

**VERIFY EACH OF THESE BEFORE COMPLETING THE TASK:**

### Rule 1: Every Page Has a UNIQUE ID
```javascript
// ❌ NEVER reuse IDs between pages
const IDS = {
  locationMethodPage: 'abc-123',  // Used by page 1
  // DON'T use 'abc-123' for page 2 - WILL CAUSE 500 ERROR!
}

// ✅ ALWAYS give each page its own ID
const IDS = {
  startPage: 'abc-123',           // Page 1
  redlineMapPage: 'def-456',      // Page 2 - DIFFERENT ID
  buildingTypePage: 'ghi-789',    // Page 3 - DIFFERENT ID
}
```

### Rule 2: Static UUIDs Only
```javascript
// ❌ NEVER generate at runtime
pages: [{ id: randomUUID() }]

// ✅ ALWAYS use static IDS object
const IDS = { page1: '5ce116c4-fbda-4227-add3-57531b29ced2' }
pages: [{ id: IDS.page1 }]
```

### Rule 3: Export as Array
```javascript
// ❌ WRONG - Can't spread
export default { formsService, outputService, formSubmissionService }

// ✅ CORRECT - Can spread in server.js
export default [{ formsService, outputService, formSubmissionService }]
```

### Rule 4: Dual-Condition Pattern
```javascript
// ❌ WRONG - Missing page condition
next: [{ path: '/option-a', condition: IDS.cond1 }]
// Page without condition property

// ✅ CORRECT - Both places
next: [{ path: '/option-a', condition: IDS.cond1 }]
{ path: '/option-a', condition: IDS.cond1, ... }  // On page too
```

### Rule 5: List Items Need IDs
```javascript
// ❌ WRONG - No id field
items: [{ text: 'Yes', value: 'yes' }]

// ✅ CORRECT - Has id for ListItemRef
items: [{ id: IDS.yesItem, text: 'Yes', value: 'yes' }]
```

### Rule 6: No Slug in Paths
```javascript
// ❌ WRONG - Duplicate slug
metadata.slug = 'my-form'
pages: [{ path: '/my-form/page-1' }]  // Results in /my-form/my-form/page-1

// ✅ CORRECT - Engine adds slug
metadata.slug = 'my-form'
pages: [{ path: '/page-1' }]  // Results in /my-form/page-1
```

### Rule 7: Valid UUIDs (Hex Only)
```javascript
// ❌ WRONG - Invalid characters (g-z)
page1: 'xyz12345-ghij-klmn-opqr-stuvwxyz1234'

// ✅ CORRECT - Only 0-9, a-f
page1: '5ce116c4-fbda-4227-add3-57531b29ced2'
```

---

## Component Types

**Input**: TextField, MultilineTextField, NumberField, EmailAddressField, TelephoneNumberField, DatePartsField, MonthYearField, UkAddressField

**Selection**: RadiosField, CheckboxesField, SelectField, AutocompleteField, YesNoField (all need `list` property except YesNoField)

**Other**: FileUploadField, Html, Para, InsetText, Details

See [`docs/DEFRA_FORMS.md`](../../docs/DEFRA_FORMS.md) for complete details.

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
