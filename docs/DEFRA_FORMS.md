# Defra Forms Engine - Complete Reference

⚠️ **CRITICAL: READ THE RULES SECTION BEFORE CREATING ANY FORMS** ⚠️

This document contains everything you need to know about implementing Defra Forms in this project.

---

## 🚨 THE 7 CRITICAL RULES - READ FIRST 🚨

**THESE MUST BE FOLLOWED OR THE FORM WILL BREAK. NO EXCEPTIONS.**

### Rule 1: Every Page MUST Have a UNIQUE ID
```javascript
// ❌ WRONG - Duplicate IDs will cause 500 errors
const IDS = {
  myPage: 'abc-123',  // Used by two pages - BREAKS!
}

// ✅ CORRECT - Every page has its own unique ID
const IDS = {
  startPage: 'abc-123',
  redlineMapPage: 'def-456',    // Different ID
  buildingTypePage: 'ghi-789',  // Different ID
  summaryPage: 'jkl-012'        // Different ID
}
```

### Rule 2: Static UUIDs Only (Never Runtime Generation)
```javascript
// ❌ WRONG - New IDs every request causes chaos
import { randomUUID } from 'crypto'
const definition = {
  pages: [{ id: randomUUID() }]  // BREAKS - different every time!
}

// ✅ CORRECT - Always the same IDs
const IDS = {
  page1: '5ce116c4-fbda-4227-add3-57531b29ced2'  // Static constant
}
const definition = {
  pages: [{ id: IDS.page1 }]  // Always the same
}
```

### Rule 3: Export as Array (For Spreading in server.js)
```javascript
// ❌ WRONG - Can't spread in server.js
export default { formsService, outputService, formSubmissionService }

// ✅ CORRECT - Array can be spread
export default [{ formsService, outputService, formSubmissionService }]
```

### Rule 4: Dual-Condition Pattern (Routing + Page Guard)
```javascript
// ❌ WRONG - Page shows always, conditional routing doesn't work
{
  path: '/choose',
  next: [{ path: '/option-a', condition: IDS.condition1 }]
}
{
  path: '/option-a',
  // Missing: condition property!
}

// ✅ CORRECT - Condition in BOTH places
{
  path: '/choose',
  next: [{ path: '/option-a', condition: IDS.condition1 }]  // In next array
}
{
  path: '/option-a',
  condition: IDS.condition1  // AND on the page itself
}
```

### Rule 5: List Items Need IDs (For Conditional Routing)
```javascript
// ❌ WRONG - Can't use in ListItemRef conditions
lists: [{
  items: [
    { text: 'Yes', value: 'yes' }  // No id field!
  ]
}]

// ✅ CORRECT - Has ID for ListItemRef
lists: [{
  items: [
    {
      id: IDS.yesItem,  // ID from IDS object
      text: 'Yes',
      value: 'yes'
    }
  ]
}]
```

### Rule 6: No Slug in Paths (Engine Adds Automatically)
```javascript
// ❌ WRONG - Duplicate slug in URL
metadata.slug = 'my-form'
pages: [
  { path: '/my-form/page-1' }  // Results in /my-form/my-form/page-1
]

// ✅ CORRECT - Engine prepends slug
metadata.slug = 'my-form'
pages: [
  { path: '/page-1' }  // Results in /my-form/page-1
]
```

### Rule 7: Valid UUIDs Only (Hex Characters Only)
```javascript
// ❌ WRONG - Contains invalid characters (g, x, y, z)
const IDS = {
  page1: 'xyz12345-ghij-klmn-opqr-stuvwxyz1234'  // Invalid!
}

// ✅ CORRECT - Only 0-9 and a-f
const IDS = {
  page1: '5ce116c4-fbda-4227-add3-57531b29ced2'  // Valid hex
}
```

---

## Package Information

- **Engine Plugin**: `@defra/forms-engine-plugin` v2.1.3
- **Model Package**: `@defra/forms-model` v3.0.567
- **Official Documentation**: https://defra.github.io/forms-engine-plugin/GETTING_STARTED.html
- **Schema Reference**: https://defra.github.io/forms-engine-plugin/schemas/
- **GitHub**: https://github.com/DEFRA/forms-runner

---

## Working Examples

All examples are in [`src/server/form-examples/`](../src/server/form-examples/):

1. **[hello-world-service.js](../src/server/form-examples/hello-world-service.js)**
   - Simple single-page form with TextField
   - Shows basic metadata, definition, and services pattern
   - No conditional routing, no lists
   - **USE THIS** for simple forms

2. **[conditional-routing-example-service.js](../src/server/form-examples/conditional-routing-example-service.js)**
   - Multi-page form with conditional branching
   - Demonstrates RadiosField with list items
   - Shows dual-condition pattern for conditional routing
   - Includes sections for summary page
   - Uses static IDS object for all UUIDs
   - **USE THIS** for forms with branching logic

---

## File Structure Pattern

Every form service file follows this structure:

```javascript
import Boom from '@hapi/boom'

// 1. Static IDS object (if needed for cross-referencing)
const IDS = {
  firstPage: '5ce116c4-fbda-4227-add3-57531b29ced2',
  nameField: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
  summaryPage: 'f1e2d3c4-b5a6-9788-6543-21fedcba9876'
  // ... all other IDs
}

// 2. Metadata
const now = new Date()
const user = { id: 'example-user', displayName: 'Example user' }
const author = {
  createdAt: now,
  createdBy: user,
  updatedAt: now,
  updatedBy: user
}

const metadata = {
  id: 'form-id',
  slug: 'form-slug',
  title: 'Form Title',
  organisation: 'Defra',
  teamName: 'Team Name',
  teamEmail: 'team@defra.gov.uk',
  submissionGuidance: 'Thanks for submitting',
  notificationEmail: 'notifications@defra.com',
  ...author,
  live: author
}

// 3. Definition
const definition = {
  name: 'Form Name',
  engine: 'V2',
  schema: 2,
  startPage: '/first-page',
  pages: [/* ... */],
  conditions: [/* if needed */],
  sections: [/* if needed */],
  lists: [/* if needed */]
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
    const referenceNumber = `REF-${Date.now()}`
    console.log('✅ Form submitted successfully!')
    console.log('Reference:', referenceNumber)
    console.log('Data:', items.map(i => ({ name: i.name, value: i.value })))

    return {
      title: 'Form submitted',
      content: `Your reference number is ${referenceNumber}`
    }
  }
}

const formSubmissionService = {
  submit: async function (payload, request) {
    const reference = `REF-${Date.now()}`
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

// 5. Export as array
export default [{ formsService, outputService, formSubmissionService }]
```

---

## Component Types Reference

### Input Components
- `TextField` - Single line text input
- `MultilineTextField` - Textarea
- `NumberField` - Numeric input
- `EmailAddressField` - Email with built-in validation
- `TelephoneNumberField` - Phone number
- `DatePartsField` - Day/month/year picker
- `MonthYearField` - Month/year only
- `UkAddressField` - UK address lookup

### Selection Components
- `RadiosField` - Radio buttons (requires `list` property)
- `CheckboxesField` - Checkboxes (requires `list` property)
- `SelectField` - Dropdown (requires `list` property)
- `AutocompleteField` - Searchable dropdown (requires `list` property)
- `YesNoField` - Yes/No toggle

### Other
- `FileUploadField` - File upload
- `Html`, `Para`, `InsetText`, `Details` - Content components

---

## Simple Form Example (No Conditionals)

```javascript
const IDS = {
  namePage: '0c8a1234-56ef-78ab-90cd-1234567890ab',
  nameField: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
  summaryPage: 'f1e2d3c4-b5a6-9788-6543-21fedcba9876'
}

const definition = {
  name: 'Simple Form',
  engine: 'V2',
  schema: 2,
  startPage: '/name',
  pages: [
    {
      title: 'What is your name?',
      path: '/name',
      components: [
        {
          type: 'TextField',
          title: 'What is your name?',
          name: 'yourName',
          hint: 'Enter your full name',
          options: { required: true },
          schema: {
            error: { required: 'Enter your name' }
          },
          id: IDS.nameField
        }
      ],
      next: [{ path: '/summary' }],
      id: IDS.namePage
    },
    {
      title: 'Check your answers',
      path: '/summary',
      controller: 'SummaryPageController',
      components: [],
      next: [],
      id: IDS.summaryPage
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}
```

---

## Conditional Routing Pattern (CRITICAL)

**The Dual-Condition Pattern** - This is THE most important pattern:

```javascript
const IDS = {
  // Components
  choiceComponent: 'd6c8c6a5-7ecb-4272-bd32-0b9db772c756',

  // Lists
  choicesList: '9d7bbe1a-6424-44fd-b0e0-0fea490a2dd0',

  // List Items (MUST have IDs for ListItemRef)
  option1Item: 'd28789ad-aeee-40f6-a39c-a2ef186465c1',
  option2Item: '83dd14f8-f957-43ca-92bb-be9fd67f3197',

  // Conditions
  option1Condition: '8d721c4c-2c43-4f57-a534-aa16ddeabb72',
  option2Condition: '481ed002-f6a8-4895-bb93-af046f1c86c3',

  // Condition Items
  option1ConditionItem: '4e9c96c8-fbd6-43f3-8cc5-8cccb991bfc0',
  option2ConditionItem: '5b195d0a-e7ea-47e3-8fc5-d077f2fb4332',

  // Pages
  choicePage: '5ce116c4-fbda-4227-add3-57531b29ced2',
  option1Page: 'df55399e-8cf3-48d1-be31-e3fec00a0ede',
  option2Page: '911adadd-b16f-4c5e-9735-f0bf9cf4ce7e'
}

const definition = {
  pages: [
    // Branching page
    {
      title: 'Choose an option',
      path: '/choose-option',
      components: [
        {
          type: 'RadiosField',
          title: 'Choose an option',
          name: 'choice',
          options: { required: true },
          list: IDS.choicesList,  // References list ID
          id: IDS.choiceComponent
        }
      ],
      // ✅ STEP 1: Conditions in next array
      next: [
        { path: '/option-1', condition: IDS.option1Condition },
        { path: '/option-2', condition: IDS.option2Condition }
      ],
      id: IDS.choicePage
    },

    // Conditional page 1
    {
      title: 'Option 1 Page',
      path: '/option-1',
      condition: IDS.option1Condition,  // ✅ STEP 2: Guard the page
      components: [/* ... */],
      next: [{ path: '/summary' }],
      id: IDS.option1Page
    },

    // Conditional page 2
    {
      title: 'Option 2 Page',
      path: '/option-2',
      condition: IDS.option2Condition,  // ✅ STEP 2: Guard the page
      components: [/* ... */],
      next: [{ path: '/summary' }],
      id: IDS.option2Page
    }
  ],

  // Define conditions
  conditions: [
    {
      items: [
        {
          id: IDS.option1ConditionItem,
          componentId: IDS.choiceComponent,  // References the RadiosField
          operator: 'is',
          value: {
            itemId: IDS.option1Item,  // References list item
            listId: IDS.choicesList   // References list
          },
          type: 'ListItemRef'
        }
      ],
      displayName: 'Option 1 selected',
      id: IDS.option1Condition
    },
    {
      items: [
        {
          id: IDS.option2ConditionItem,
          componentId: IDS.choiceComponent,
          operator: 'is',
          value: {
            itemId: IDS.option2Item,
            listId: IDS.choicesList
          },
          type: 'ListItemRef'
        }
      ],
      displayName: 'Option 2 selected',
      id: IDS.option2Condition
    }
  ],

  // Define lists (items MUST have IDs for ListItemRef)
  lists: [
    {
      name: 'choices',
      title: 'Choices',
      type: 'string',
      id: IDS.choicesList,
      items: [
        {
          id: IDS.option1Item,  // ✅ MUST have ID
          text: 'Option 1',
          value: 'Option 1'
        },
        {
          id: IDS.option2Item,  // ✅ MUST have ID
          text: 'Option 2',
          value: 'Option 2'
        }
      ]
    }
  ]
}
```

---

## Validation Schema

```javascript
schema: {
  max: 100,           // Maximum length/value
  min: 2,             // Minimum length/value
  regex: '^[A-Z].*',  // Pattern matching
  error: {
    required: 'Enter a value',
    max: 'Must be 100 characters or less',
    min: 'Must be at least 2 characters',
    regex: 'Must start with a capital letter'
  }
}
```

---

## Sections (For Summary Page)

```javascript
{
  pages: [
    {
      path: '/page-1',
      section: 'personalDetails',  // References section name
      // ...
    },
    {
      path: '/page-2',
      section: 'personalDetails',
      // ...
    }
  ],
  sections: [
    {
      name: 'personalDetails',
      title: 'Personal details'
    }
  ]
}
```

---

## Registering Forms in server.js

Current pattern in [`src/server/server.js`](../src/server/server.js):

```javascript
import helloWorldServices from './form-examples/hello-world-service.js'
import conditionalRoutingServices from './form-examples/conditional-routing-example-service.js'

// Combine all form services
const allServices = [...helloWorldServices, ...conditionalRoutingServices]

// Merged services implementation
const formsMap = new Map()

const mergedServices = {
  formsService: {
    getFormMetadata: async (slug) => {
      for (const service of allServices) {
        try {
          const metadata = await service.formsService.getFormMetadata(slug)
          formsMap.set(metadata.id, service)
          return metadata
        } catch (e) { /* Try next */ }
      }
      throw new Error(`Form '${slug}' not found`)
    },
    getFormDefinition: async (id) => {
      for (const service of allServices) {
        try {
          return await service.formsService.getFormDefinition(id)
        } catch (e) { /* Try next */ }
      }
      throw new Error(`Form '${id}' not found`)
    }
  },
  outputService: {
    submit: async (context, request, model, emailAddress, items, submitResponse) => {
      const formId = model?.def?.id || model?.formId
      const service = formsMap.get(formId) || allServices[0]
      return await service.outputService.submit(context, request, model, emailAddress, items, submitResponse)
    }
  },
  formSubmissionService: {
    submit: async (payload, request) => {
      const service = allServices[0]
      return await service.formSubmissionService.submit(payload, request)
    },
    persistFiles: async (context, request, model) {
      const formId = model?.def?.id || model?.formId
      const service = formsMap.get(formId) || allServices[0]
      return await service.formSubmissionService.persistFiles(context, request, model)
    }
  }
}

await server.register({
  plugin: formsPlugin,
  options: {
    services: mergedServices,
    // ... other options
  }
})
```

---

## Common Mistakes (DO NOT DO THESE)

### ❌ Runtime UUID Generation
```javascript
// WRONG - New IDs every time!
import { randomUUID } from 'crypto'
const definition = {
  pages: [{ id: randomUUID() }]  // ❌
}
```

### ✅ Static UUIDs
```javascript
// CORRECT - Always the same
const IDS = {
  page1: '5ce116c4-fbda-4227-add3-57531b29ced2'
}
const definition = {
  pages: [{ id: IDS.page1 }]  // ✅
}
```

### ❌ Export as Object
```javascript
// WRONG - Can't spread in server.js
export default { formsService, outputService, formSubmissionService }  // ❌
```

### ✅ Export as Array
```javascript
// CORRECT - Can spread
export default [{ formsService, outputService, formSubmissionService }]  // ✅
```

### ❌ Missing Page Condition
```javascript
// WRONG - Page shows always
{
  path: '/branch',
  next: [{ path: '/option-a', condition: 'cond1' }]
}
{
  path: '/option-a',
  // ❌ Missing: condition: 'cond1'
}
```

### ✅ Dual-Condition Pattern
```javascript
// CORRECT - Condition in both places
{
  path: '/branch',
  next: [{ path: '/option-a', condition: 'cond1' }]
}
{
  path: '/option-a',
  condition: 'cond1'  // ✅
}
```

### ❌ List Items Without IDs
```javascript
// WRONG - Can't use ListItemRef
lists: [{
  items: [
    { text: 'Option 1', value: 'opt1' }  // ❌ No id
  ]
}]
```

### ✅ List Items With IDs
```javascript
// CORRECT - Can use ListItemRef
lists: [{
  items: [
    {
      id: 'd28789ad-aeee-40f6-a39c-a2ef186465c1',  // ✅
      text: 'Option 1',
      value: 'opt1'
    }
  ]
}]
```

### ❌ Slug in Paths
```javascript
// WRONG - Duplicate slug
metadata.slug = 'my-form'
definition.pages = [
  { path: '/my-form/page-1' }  // ❌ Results in /my-form/my-form/page-1
]
```

### ✅ No Slug in Paths
```javascript
// CORRECT - Engine adds slug
metadata.slug = 'my-form'
definition.pages = [
  { path: '/page-1' }  // ✅ Results in /my-form/page-1
]
```

---

## Troubleshooting

### Form returns 404
- **Cause**: Missing `condition` property on conditional pages
- **Fix**: Add `condition: IDS.conditionName` to the page

### "must be a valid GUID" error
- **Cause**: UUID contains non-hex characters (g-z)
- **Fix**: Regenerate UUIDs with only 0-9, a-f

### All pages show (no branching)
- **Cause**: Missing `condition` property on pages
- **Fix**: Use dual-condition pattern

### "is not iterable" error
- **Cause**: Exported as object instead of array
- **Fix**: Export as `[{ ... }]`

### Summary page empty
- **Cause**: Missing `sections` array or pages don't reference sections
- **Fix**: Add sections and `section:` property to pages

---

## Generating UUIDs

Run in terminal:
```bash
node -e "for(let i=0; i<20; i++) console.log(require('crypto').randomUUID())"
```

Copy and paste into your IDS object. Generate more than you think you need.

---

## URL Structure

Forms are automatically mounted at:
```
http://localhost:3000/{slug}/{page-path}
```

Example:
- `metadata.slug = 'location-form'`
- `page.path = '/enter-postcode'`
- URL: `http://localhost:3000/location-form/enter-postcode`

---

Last updated: October 24, 2025
