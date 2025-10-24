---
name: new-journey
description: Create a new Defra Forms journey from specification
parameters:
  - name: prompt
    description: Path to markdown file with journey specification
    required: true
---

# Create New Defra Forms Journey

**BEFORE STARTING**: Read [`docs/DEFRA_FORMS.md`](../../docs/DEFRA_FORMS.md) for complete reference.

## Quick Checklist

- [ ] Read the spec file at `{prompt}`
- [ ] Count total pages needed (including summary)
- [ ] Identify if conditional routing is needed
- [ ] Generate all UUIDs upfront: `node -e "for(let i=0; i<20; i++) console.log(require('crypto').randomUUID())"`
- [ ] Review [`hello-world-service.js`](../../src/server/form-examples/hello-world-service.js) (simple form)
- [ ] Review [`conditional-routing-example-service.js`](../../src/server/form-examples/conditional-routing-example-service.js) (conditional routing)

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

### 2. Create Service File

Create `src/server/form-examples/{slug}-service.js`:

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

### 5. Test

1. Start server: `npm run dev`
2. Visit: `http://localhost:3000`
3. Click form link
4. Test ALL pages
5. Test conditional routing (if applicable)
6. Submit form
7. Verify confirmation page

---

## Critical Rules (MUST FOLLOW)

1. ✅ **Static UUIDs** - All IDs in IDS object, NEVER `randomUUID()` inside definitions
2. ✅ **Export as array** - `export default [{ ... }]`
3. ✅ **Dual-condition** - Conditions in `next` array AND `condition` property on pages
4. ✅ **List item IDs** - Required for `ListItemRef` conditions
5. ✅ **No slug in paths** - Engine adds automatically
6. ✅ **Valid UUIDs** - Only 0-9, a-f (no g-z)

---

## Component Types

**Input**: TextField, MultilineTextField, NumberField, EmailAddressField, TelephoneNumberField, DatePartsField, MonthYearField, UkAddressField

**Selection**: RadiosField, CheckboxesField, SelectField, AutocompleteField, YesNoField (all need `list` property except YesNoField)

**Other**: FileUploadField, Html, Para, InsetText, Details

See [`docs/DEFRA_FORMS.md`](../../docs/DEFRA_FORMS.md) for complete details.

---

## If You Get Stuck

1. Check [`docs/DEFRA_FORMS.md`](../../docs/DEFRA_FORMS.md) - Complete reference
2. Review working examples in `src/server/form-examples/`
3. Official Defra Forms docs: https://defra.github.io/forms-engine-plugin/GETTING_STARTED.html
4. Verify all 6 critical rules are followed
