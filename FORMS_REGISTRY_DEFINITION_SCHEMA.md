# Forms Registry Definition Schema Documentation

## Overview

This document describes the **V2 form definition schema** for the DEFRA Forms Engine Plugin. When registering a form with the forms registry using `formsRegistry.set()`, you provide a `definition` object that follows this schema.

## Registry Structure

```javascript
formsRegistry.set('form-slug', {
  metadata: {
    // Form metadata (created by createMetadata function)
    id: 'uuid',
    slug: 'form-slug',
    title: 'Form Title',
    organisation: 'Defra',
    teamName: 'Development Team',
    teamEmail: 'dev-team@defra.gov.uk',
    notificationEmail: 'submissions@defra.gov.uk',
    submissionGuidance: '...',
    // ... other metadata
  },
  definition: {
    // THIS IS THE FORM DEFINITION SCHEMA (documented below)
  }
})
```

## Form Definition Schema (V2)

The `definition` object must conform to the following structure:

### Root Properties

```javascript
{
  // Schema version - REQUIRED for V2 forms
  schema: 2,

  // Engine version (optional, defaults to V1)
  engine: "V2",

  // Form name - descriptive name for the form
  name: "My Form Name",

  // Starting page path - REQUIRED
  startPage: "/first-page",

  // Pages array - REQUIRED
  pages: [...],

  // Lists for selection components - REQUIRED (can be empty array)
  lists: [...],

  // Conditions for logic - REQUIRED (can be empty array)
  conditions: [...],

  // Sections for grouping - REQUIRED (can be empty array)
  sections: [...],

  // Optional properties
  feedback: {...},
  phaseBanner: {...},
  declaration: "...",
  skipSummary: false,
  metadata: {...},
  outputEmail: "email@example.com",
  output: {...}
}
```

### Pages

Each page in the `pages` array must follow this structure:

```javascript
{
  // Unique identifier (UUID) - RECOMMENDED for V2
  id: "550e8400-e29b-41d4-a716-446655440000",

  // Page URL path - REQUIRED
  path: "/page-path",

  // Page title - REQUIRED (can be empty string in V2)
  title: "Page Title",

  // Components on the page (depends on controller type)
  components: [...],

  // Navigation links - REQUIRED (can be empty array)
  next: [...],

  // Optional properties
  controller: "ControllerType",  // Special page controller
  section: "section-name",        // Section this page belongs to
  condition: "condition-id",      // Show page only if condition is met
  view: "custom-view",            // Custom view template
  events: {...},                  // Page lifecycle events

  // For RepeatPageController only
  repeat: {
    options: {
      name: "items",
      title: "Item"
    },
    schema: {
      min: 1,
      max: 10
    }
  }
}
```

### Components

Components define the form fields and content elements:

```javascript
{
  // Unique identifier (UUID) - REQUIRED for V2
  id: "550e8400-e29b-41d4-a716-446655440001",

  // Component type - REQUIRED
  type: "TextField",  // See component types below

  // Internal name for data storage - REQUIRED for input components
  name: "fieldName",

  // Display title - REQUIRED for input components
  title: "Field Label",

  // Optional properties
  hint: "Help text for the field",
  shortDescription: "Brief description",

  // Component-specific options
  options: {
    required: true,
    classes: "govuk-input--width-20",
    rows: 5,  // For MultilineTextField
    maxWords: 500,
    maxDaysInPast: 365,
    maxDaysInFuture: 30,
    customValidationMessage: "Custom error message",
    customValidationMessages: {
      required: "This field is required",
      min: "Value too small"
    },
    accept: "application/pdf,image/jpeg"  // For FileUploadField
  },

  // Validation schema
  schema: {
    min: 2,     // Minimum value/length
    max: 100,   // Maximum value/length
    length: 10  // Exact length
  },

  // Validation rules (alternative to schema)
  validation: {
    required: true
  },

  // For selection components (RadiosField, CheckboxesField, SelectField, AutocompleteField)
  list: "list-id-reference",

  // For content components (Html, Markdown, InsetText)
  content: "<p>HTML content here</p>"
}
```

### Component Types

#### Input Components
- `TextField` - Single-line text input
- `MultilineTextField` - Multi-line textarea
- `NumberField` - Numeric input
- `EmailAddressField` - Email with validation
- `TelephoneNumberField` - Phone number
- `DatePartsField` - Date with day/month/year fields
- `MonthYearField` - Month and year only
- `YesNoField` - Binary yes/no choice
- `UkAddressField` - UK address fields

#### Selection Components
- `RadiosField` - Radio buttons (single choice)
- `CheckboxesField` - Checkboxes (multiple choice)
- `SelectField` - Dropdown select
- `AutocompleteField` - Searchable dropdown

#### Content Components
- `Html` - Raw HTML content
- `Markdown` - Markdown content
- `InsetText` - Highlighted inset text
- `Details` - Expandable details
- `List` - Bullet or numbered list

#### File Upload
- `FileUploadField` - File upload component

### Lists

Define reusable option sets for selection components:

```javascript
{
  // Unique identifier (UUID) - REQUIRED for V2
  id: "550e8400-e29b-41d4-a716-446655440010",

  // Internal name - REQUIRED
  name: "myList",

  // Display title - REQUIRED
  title: "My List",

  // Data type - REQUIRED
  type: "string",  // or "number", "boolean"

  // List items - REQUIRED
  items: [
    {
      // Item ID (UUID) - REQUIRED for V2
      id: "550e8400-e29b-41d4-a716-446655440011",

      // Display text - REQUIRED
      text: "Option One",

      // Stored value - REQUIRED
      value: "option-1",

      // Optional hint for this item
      hint: {
        text: "Additional help text"
      },

      // Conditional display
      condition: "condition-id",

      // Conditional content (for checkboxes)
      conditional: {
        components: [...]
      }
    }
  ]
}
```

### Conditions (V2 Format)

Define logic for conditional navigation and display:

```javascript
{
  // Unique identifier (UUID) - REQUIRED
  id: "550e8400-e29b-41d4-a716-446655440020",

  // Display name for UI - REQUIRED
  displayName: "Is Option A Selected",

  // Logical operator - optional (defaults to "and")
  coordinator: "and",  // or "or"

  // Condition items - REQUIRED
  items: [
    {
      // Item ID (UUID) - REQUIRED
      id: "550e8400-e29b-41d4-a716-446655440021",

      // Component to evaluate - REQUIRED
      componentId: "component-uuid",

      // Comparison operator - REQUIRED
      operator: "is",  // See operators below

      // Value type - REQUIRED
      type: "value",  // or "ListItemRef"

      // Value to compare against - REQUIRED
      value: "expected-value",

      // For ListItemRef type:
      value: {
        itemId: "list-item-uuid",
        listId: "list-uuid"
      }
    }
  ]
}
```

#### Available Operators
- `is` - Equals
- `is not` - Not equals
- `contains` - Contains value (for arrays/checkboxes)
- `does not contain` - Does not contain
- `greaterThan` - Greater than
- `lessThan` - Less than
- `isEmpty` - Field is empty
- `isNotEmpty` - Field has value

### Navigation (next)

Define page flow with conditional branching:

```javascript
next: [
  {
    // Target page path - REQUIRED
    path: "/next-page",

    // Optional condition (show this link only if condition is true)
    condition: "condition-id",

    // Optional external redirect
    redirect: "https://external-url.com"
  }
]
```

### Sections

Group related pages:

```javascript
{
  // Internal name - REQUIRED
  name: "personal-details",

  // Display title - REQUIRED
  title: "Personal Details",

  // Hide title in UI - optional
  hideTitle: false
}
```

### Additional Configuration

#### Feedback
```javascript
feedback: {
  feedbackForm: true,  // Use built-in feedback form
  url: "https://feedback-url.com",  // Or external feedback URL
  emailAddress: "feedback@example.com"
}
```

#### Phase Banner
```javascript
phaseBanner: {
  phase: "beta",  // or "alpha"
  feedbackUrl: "https://feedback-url.com"
}
```

#### Output Configuration
```javascript
output: {
  audience: "machine",  // or "human"
  version: "2"
}
```

## Controller Types

Special page controllers for different behaviors:

- `"SummaryPageController"` - Check answers page
- `"FileUploadPageController"` - File upload handling
- `"RepeatPageController"` - Repeating sections
- `"StartPageController"` - Form start page
- `"StatusPageController"` - Submission confirmation
- Default (no controller) - Standard question page

## Complete V2 Example

```javascript
const formDefinition = {
  schema: 2,
  engine: "V2",
  name: "Example V2 Form",
  startPage: "/applicant-type",

  pages: [
    {
      id: "page-001",
      path: "/applicant-type",
      title: "What type of applicant are you?",
      components: [
        {
          id: "comp-001",
          type: "RadiosField",
          name: "applicantType",
          title: "Select your applicant type",
          list: "list-001",
          validation: {
            required: true
          }
        }
      ],
      next: [
        {
          path: "/individual-details",
          condition: "cond-001"
        },
        {
          path: "/business-details",
          condition: "cond-002"
        }
      ]
    },
    {
      id: "page-002",
      path: "/individual-details",
      title: "Individual Details",
      components: [
        {
          id: "comp-002",
          type: "TextField",
          name: "firstName",
          title: "First name",
          schema: {
            min: 2,
            max: 100
          },
          validation: {
            required: true
          }
        },
        {
          id: "comp-003",
          type: "TextField",
          name: "lastName",
          title: "Last name",
          schema: {
            min: 2,
            max: 100
          },
          validation: {
            required: true
          }
        }
      ],
      next: [
        {
          path: "/summary"
        }
      ]
    },
    {
      id: "page-003",
      path: "/business-details",
      title: "Business Details",
      components: [
        {
          id: "comp-004",
          type: "TextField",
          name: "companyName",
          title: "Company name",
          validation: {
            required: true
          }
        }
      ],
      next: [
        {
          path: "/summary"
        }
      ]
    },
    {
      id: "page-004",
      path: "/summary",
      title: "Check your answers",
      controller: "SummaryPageController",
      components: [],
      next: []
    }
  ],

  lists: [
    {
      id: "list-001",
      name: "applicantTypes",
      title: "Applicant Types",
      type: "string",
      items: [
        {
          id: "item-001",
          text: "Individual",
          value: "individual"
        },
        {
          id: "item-002",
          text: "Business",
          value: "business"
        }
      ]
    }
  ],

  conditions: [
    {
      id: "cond-001",
      displayName: "Is Individual",
      items: [
        {
          id: "cond-item-001",
          componentId: "comp-001",
          operator: "is",
          type: "ListItemRef",
          value: {
            itemId: "item-001",
            listId: "list-001"
          }
        }
      ]
    },
    {
      id: "cond-002",
      displayName: "Is Business",
      items: [
        {
          id: "cond-item-002",
          componentId: "comp-001",
          operator: "is",
          type: "ListItemRef",
          value: {
            itemId: "item-002",
            listId: "list-001"
          }
        }
      ]
    }
  ],

  sections: [],

  outputEmail: "submissions@defra.gov.uk"
}
```

## Important Notes

1. **V2 Schema Requires UUIDs**: All `id` fields should be valid UUIDs in V2
2. **Schema Version**: Always specify `schema: 2` for V2 forms
3. **Empty Arrays**: `lists`, `conditions`, and `sections` can be empty arrays but must be present
4. **Component Names**: Must be unique across the entire form
5. **Path Format**: Page paths must start with `/`
6. **Validation**: Use either `schema` or `validation` property, not both
7. **List References**: Components reference lists by the list's `id` in V2
8. **Condition References**: Use condition `id` (UUID) in navigation and display logic

## Migration from V1

Key differences when migrating from V1 to V2:
1. Add `schema: 2` property
2. Add UUID `id` fields to all components, lists, list items, and conditions
3. Update condition format from V1 `value` object to V2 `items` array
4. Change list references from `name` to `id`
5. Update condition references to use UUIDs

## Validation

The form definition is validated against the `formDefinitionV2Schema` from `@defra/forms-model` when the FormModel is instantiated. Any validation errors will prevent the form from loading.