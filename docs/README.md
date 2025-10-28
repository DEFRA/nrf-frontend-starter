# Natural England Nature Restoration Fund - User Journeys

Production-ready user journeys for the Natural England Nature Restoration Fund (NRF) service.

## Overview

The Nature Restoration Fund (NRF) is a government initiative to restore nature and tackle climate change. This repository contains the frontend application that serves different parts of the NRF service.

The application is built using Hapi.js, Nunjucks, and the GOV.UK Frontend, following government service design best practices and the GDS Service Standard.

## Purpose

The primary goals of this application are to:

- **Deliver user journeys** - Provide accessible, secure, and reliable user journeys for the NRF service
- **Follow best practices** - Implement government service design patterns and accessibility standards
- **Maintain quality** - Ensure code quality, security, and performance
- **Support users** - Create intuitive and accessible experiences for all users
- **Enable iteration** - Support continuous improvement based on user feedback and analytics

## Current Journeys

| Journey                             | Description                                                                 | Key Features                                                                                                                                                                                           |
| ----------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **User Journey 1**                  | Sample journey demonstrating basic user flow within the NRF context         | Basic user flow demonstration                                                                                                                                                                          |
| **Applications**                    | Application process for environmental levy payments                         | • Application start and data collection<br>• Location selection (postcode, coordinates, drawing, file upload)<br>• Payment processing<br>• Application summary and confirmation                        |
| **EDP Search**                      | Environmental Data Platform (EDP) search functionality                      | • Search interface and filters<br>• Location-based searching<br>• Results display and details<br>• Print functionality                                                                                 |
| **LPA Application Verification**    | Local Planning Authority staff can verify environmental levy payments       | • Application reference and developer verification<br>• Payment status and development details display<br>• Interactive map showing development and EDP boundaries<br>• Standard GOV.UK error handling |
| **Natural England Case Management** | Staff interface for managing developer applications and processing payments | • Application dashboard with filtering and search<br>• Individual application review and editing<br>• Payment processing and status updates<br>• Audit trail and export functionality                  |

## Project Structure

```
nrf-frontend-starter/
├── src/
│   ├── server/
│   │   ├── forms/           # User journey forms (each is a Hapi plugin)
│   │   │   └── {journey}/   # e.g., hello-world, nrf-estimate-1
│   │   │       ├── index.js          # Plugin registration
│   │   │       ├── routes.js         # Route path constants
│   │   │       ├── controller.js     # Request handlers
│   │   │       ├── controller.test.js # Controller tests
│   │   │       └── views/            # Nunjucks templates (.njk)
│   │   ├── common/          # Shared utilities and helpers
│   │   ├── home/            # Home page
│   │   ├── about/           # About page
│   │   ├── health/          # Health check
│   │   └── router.js        # Main router that registers all plugins
│   ├── config/
│   │   └── nunjucks/        # Nunjucks configuration and filters
│   └── assets/              # Frontend assets (compiled by webpack)
├── docs/                    # Documentation
└── package.json             # Project dependencies and scripts
```

## Adding New Journeys

To add a new user journey, follow the pattern used in `src/server/forms/hello-world/`:

1. **Create journey directory** under `src/server/forms/{journey-name}/`
2. **Create `routes.js`** with BASE_PATH and ROUTES object defining all route paths
3. **Create `controller.js`** with handler functions for each GET and POST route
4. **Create `index.js`** to export the Hapi plugin and register routes
5. **Create `views/`** directory with Nunjucks templates (.njk files) for each page
6. **Register the plugin** in `src/server/router.js`
7. **Add tests** in `controller.test.js`
8. **Document the journey** in this README

### Example Structure

See [src/server/forms/hello-world/](../src/server/forms/hello-world/) for a complete working example showing:

- Route path constants in `routes.js`
- GET and POST controller handlers in `controller.js`
- Session management using `request.yar`
- Conditional routing logic
- GOV.UK Frontend component usage in views

## Required Implementation Patterns

When creating new journeys, you **MUST** implement these patterns (see `hello-world` for examples):

### 1. Back Links

**Every page except start** must have a back link:

```javascript
// Controller - Use journey name prefix for template paths
return h.view('journey-name/page', {
  backLink: ROUTES.PREVIOUS_PAGE // Calculate conditionally if needed
})

// Examples:
return h.view('nrf-estimate-1/start', { ... })
return h.view('hello-world/color', { ... })
```

```njk
{# Template #}
{% from "govuk/components/back-link/macro.njk" import govukBackLink %}
{% block beforeContent %}
  {{ govukBackLink({ href: backLink }) }}
{% endblock %}
```

**Conditional Back Links**: Calculate based on user journey

```javascript
const backLink = userChoice === 'optionA' ? ROUTES.PAGE_A : ROUTES.PAGE_B
```

### 2. Change Links on Summary Page

Summary page must allow users to change their answers:

```javascript
// Controller - Pass ROUTES object (not string!)
return h.view('forms/journey/views/summary', {
  fieldValue: request.yar.get('field'),
  ROUTES // Pass entire ROUTES object
})
```

```njk
{# Template #}
{{ govukSummaryList({
  rows: [{
    key: { text: "Field name" },
    value: { text: fieldValue },
    actions: {
      items: [{
        href: ROUTES.FIELD_PAGE,
        text: "Change",
        visuallyHiddenText: "field name"
      }]
    }
  }]
}) }}
```

### 3. Session Management

```javascript
// POST controllers - Save data
request.yar.set('fieldName', value)

// GET controllers - Retrieve data
const value = request.yar.get('fieldName')

// Confirmation - Clear session
request.yar.reset()
```

### 4. Error Handling

```javascript
// POST controller - Flash error
if (!value) {
  request.yar.flash('error', 'Error message here')
  return h.redirect(ROUTES.CURRENT_PAGE)
}

// GET controller - Retrieve error
const error = request.yar.flash('error')[0]
```

```njk
{# Template - Show error summary #}
{% if error %}
  {{ govukErrorSummary({
    titleText: "There is a problem",
    errorList: [{ text: error, href: "#field-id" }]
  }) }}
{% endif %}

{# Field-level errors - Use inline if syntax #}
{{ govukInput({
  name: "fieldName",
  errorMessage: { text: error } if error
}) }}

{# ❌ NEVER use ternary with null - causes 500 errors #}
{# errorMessage: error ? { text: error } : null #}
```

### 5. Form Submission Pattern

```njk
<form method="post" novalidate>
  {# Form fields #}
  {{ govukButton({ text: "Continue" }) }}
</form>
```

POST controller must validate and redirect:

```javascript
if (!valid) {
  request.yar.flash('error', 'Error message')
  return h.redirect(ROUTES.CURRENT_PAGE)
}
request.yar.set('field', value)
return h.redirect(ROUTES.NEXT_PAGE)
```

### 6. Guard Redirects

Summary and confirmation pages should check for session data:

```javascript
export const summaryController = {
  handler(request, h) {
    const data = request.yar.get('requiredField')
    if (!data) {
      return h.redirect(ROUTES.START)
    }
    // ... render page
  }
}
```

### 7. Conditional Summary Rows

Only show relevant fields based on user choices:

```njk
{{ govukSummaryList({
  rows: [
    {
      key: { text: "Always shown" },
      value: { text: value }
    },
    {
      key: { text: "Conditional field" },
      value: { text: conditionalValue }
    } if condition === "value",
    {
      key: { text: "Another field" },
      value: { text: anotherValue }
    }
  ]
}) }}
```

## Common Issues and Solutions

### Issue: 415 Unsupported Media Type on File Upload

**Problem**: Form has `enctype="multipart/form-data"` but Hapi isn't configured to parse it

**Solutions**:

1. If you need actual file uploads, configure Hapi payload parsing
2. If mocking file uploads, remove `enctype="multipart/form-data"` from form

### Issue: Summary Page Doesn't Submit

**Problem**: Form POST but no POST route registered

**Solution**: Add POST route in `index.js`:

```javascript
{
  method: 'POST',
  path: ROUTES.SUMMARY,
  ...postSummaryController
}
```

### Issue: Multiple Selections Need Multiple Pages

**Problem**: User selects multiple checkboxes but only one page shown

**Approaches**:

1. **Multi-page flow**: Show separate page for each selection (requires dynamic routing)
2. **Single page with multiple inputs**: Show all relevant fields at once (simpler, often better UX)

### Issue: Checkboxes Array Not Working

**Problem**: Checkbox values not properly checked

**Solution**: Normalize to array in POST controller:

```javascript
let { options } = request.payload
// Checkboxes: array when multiple selected, single value when one selected
if (!Array.isArray(options)) {
  options = options ? [options] : []
}
```

### Issue: Wrong Back Links

**Problem**: Back link doesn't match user's journey path

**Solution**: Calculate back link based on session data:

```javascript
const previousChoice = request.yar.get('choice')
const backLink = previousChoice === 'optionA' ? ROUTES.PAGE_A : ROUTES.PAGE_B
```

### Issue: Showing All Summary Fields

**Problem**: Summary shows fields from paths user didn't take

**Solution**: Use conditional rows (see pattern #7 above)

### Issue: Template Rendering Error (500) with Incorrect Template Paths

**Problem**: Using incorrect template paths in `h.view()` calls causes 500 Internal Server Error.

**Bad Pattern** ❌:

```javascript
// Missing journey name prefix
return h.view('start', { ... })
return h.view('summary', { ... })
```

**Why it fails**: Hapi can't find the template files because they're located in `src/server/forms/{journey}/views/` but the path doesn't include the journey name.

**Good Pattern** ✅:

```javascript
// Include journey name prefix
return h.view('nrf-estimate-1/start', { ... })
return h.view('nrf-estimate-1/summary', { ... })
```

**Template Path Rules**:

- Always use `{journey-name}/{template-name}` format
- Journey name must match the directory name in `src/server/forms/`
- Template name must match the `.njk` file name (without extension)

**Examples**:

```javascript
// For journey in src/server/forms/nrf-estimate-1/
return h.view('nrf-estimate-1/start', { ... })
return h.view('nrf-estimate-1/what-would-you-like-to-do', { ... })

// For journey in src/server/forms/hello-world/
return h.view('hello-world/start', { ... })
return h.view('hello-world/color', { ... })
```

### Issue: Template Rendering Error (500) with Conditional Properties

**Problem**: Using ternary operators or `null` in Nunjucks macro parameters causes 500 Internal Server Error

**Bad Pattern** ❌:

```njk
{{ govukTextarea({
  name: "field",
  errorMessage: error ? { text: error } : null
}) }}
```

**Why it fails**: Nunjucks doesn't handle `null` values in macro parameters, causing template rendering to crash with a 500 error.

**Good Pattern** ✅:

```njk
{{ govukTextarea({
  name: "field",
  errorMessage: { text: error } if error
}) }}
```

**Apply to all conditional properties**:

- `errorMessage` - show only when error exists
- `value` - show only when data exists
- Any conditional macro parameter

**Example from real code**:

```njk
{# File upload component #}
{{ govukFileUpload({
  id: "uploadFile",
  name: "uploadFile",
  errorMessage: { text: error } if error
}) }}

{# Input with conditional value #}
{{ govukInput({
  id: "email",
  name: "email",
  value: email if email,
  errorMessage: { text: error } if error
}) }}
```

## Content Review and Specification Compliance

### Critical Implementation Requirements

**IMPORTANT**: See [implementation-requirements.md](./implementation-requirements.md) for critical requirements that MUST be implemented for 100% specification compliance, including:

- Planning reference field for payment journeys
- Production content requirements (replacing placeholders)
- EDP boundary validation implementation
- File upload validation completeness
- Admin charge amount updates

### File Upload Validation Pattern

When implementing file uploads, include all validation scenarios from the specification:

```javascript
export const postUploadController = {
  handler(request, h) {
    const { uploadFile } = request.payload

    // Required validations from spec:
    if (!uploadFile) {
      request.yar.flash('error', 'Select a file to upload')
      return h.redirect(ROUTES.UPLOAD)
    }

    // File type validation
    const allowedTypes = ['shp', 'geojson']
    const fileExtension = uploadFile.split('.').pop().toLowerCase()
    if (!allowedTypes.includes(fileExtension)) {
      request.yar.flash('error', 'The selected file must be a [shp,geojson]')
      return h.redirect(ROUTES.UPLOAD)
    }

    // File size validation (2MB limit)
    if (uploadFile.size > 2 * 1024 * 1024) {
      request.yar.flash('error', 'The [file] must be smaller than 2MB')
      return h.redirect(ROUTES.UPLOAD)
    }

    // Empty file validation
    if (uploadFile.size === 0) {
      request.yar.flash('error', 'The selected file is empty')
      return h.redirect(ROUTES.UPLOAD)
    }

    // Continue with successful upload
    request.yar.set('uploadedFile', uploadFile)
    return h.redirect(ROUTES.NEXT_PAGE)
  }
}
```

### Dynamic Content Implementation

Use actual session data instead of static values for dynamic content:

```javascript
// Dynamic title based on user selection
export const getDynamicPageController = {
  handler(request, h) {
    const buildingType = request.yar.get('buildingType')
    const dynamicTitle = `Enter the number of rooms in your ${buildingType.toLowerCase()} building(s) planned for the development`

    return h.view('forms/journey/views/dynamic-page', {
      pageTitle: dynamicTitle,
      heading: dynamicTitle,
      buildingType
    })
  }
}

// Email content with dynamic data
export const getEmailContentController = {
  handler(request, h) {
    const emailData = {
      estimateReference: `EST-${Date.now().toString().slice(-6)}`,
      edpArea: request.yar.get('edpArea') || 'Thames Valley EDP',
      residentialCount: request.yar.get('residentialBuildingCount'),
      hotelCount: request.yar.get('hotelCount'),
      hmoCount: request.yar.get('hmoCount'),
      levyAmount: calculateLevyAmount(request.yar.get('buildingData'))
    }

    return h.view('forms/journey/views/email-content', emailData)
  }
}
```

### Content Review Process

Use the `/content-review` command to verify specification compliance:

```
/content-review journey:[journey-name] spec-file:[specification-path]
```

This command will:

1. Parse the specification file
2. Examine the journey implementation
3. Compare content against specification
4. Identify gaps and inconsistencies
5. Provide prioritized recommendations

**Example usage**:

```
/content-review journey:nrf-estimate-1 spec-file:prompts/prototype-1/01-quote-journey-v4.md
```

## Validation Checklist

Before considering a journey complete, verify:

**Setup**

- [ ] Plugin registered in `src/server/router.js`
- [ ] Journey link added to home page table

**Navigation**

- [ ] All pages have back links (except start)
- [ ] Back links point to correct previous page
- [ ] Summary has Change links with ROUTES object passed
- [ ] All links use ROUTES constants (not hardcoded paths)
- [ ] Template paths use correct journey-name/template format (prevents 500 errors)

**Forms & Validation**

- [ ] Forms use `method="post" novalidate"`
- [ ] POST controllers validate input
- [ ] Errors flash and redirect back to form
- [ ] Error summary displayed when errors present
- [ ] Field-level errors shown on inputs

**Session Management**

- [ ] POST controllers save data with `request.yar.set()`
- [ ] GET controllers retrieve data with `request.yar.get()`
- [ ] Summary retrieves all data from session
- [ ] Confirmation clears session with `request.yar.reset()`
- [ ] Summary/confirmation have guard redirects

**Content Accuracy**

- [ ] All page titles match specification exactly
- [ ] All form labels match specification exactly
- [ ] All error messages match specification word-for-word
- [ ] All button text match specification exactly
- [ ] Form options in correct order
- [ ] Dynamic content uses actual session data (not static values)
- [ ] File upload validation includes all error scenarios from spec
- [ ] Planning reference field implemented for payment journeys
- [ ] All placeholder contact information replaced with real values
- [ ] EDP boundary validation uses real logic (not hardcoded)
- [ ] Admin charge amounts show actual values (not £00)

**End-to-End Testing**

- [ ] Can complete journey from start to confirmation
- [ ] Can navigate back without losing data
- [ ] Can change answers from summary page
- [ ] Conditional paths work correctly
- [ ] No 404 or 415 errors on form submission
- [ ] Journey accessible from home page

**Specification Compliance**

- [ ] Use `/content-review` command to verify 100% compliance
- [ ] All dynamic content requirements implemented
- [ ] All conditional logic paths tested
- [ ] All error scenarios covered

### Best Practices for New Journeys

- **Follow GOV.UK patterns** - Use established design patterns and components
- **Include clear navigation** - Help users understand where they are in the journey
- **Test with users** - Validate the journey with real users when possible
- **Document assumptions** - Note any assumptions made during implementation
- **Consider accessibility** - Ensure journeys work for all users

## Business Context

### Nature Restoration Fund

The Nature Restoration Fund supports projects that:

- Restore and create wildlife-rich habitats
- Reduce flood risk and improve water quality
- Enhance public access to nature
- Support climate change mitigation and adaptation

### Service Design Approach

These prototypes follow the Government Digital Service (GDS) service design methodology:

1. **Discovery** - Understanding user needs and service requirements
2. **Alpha** - Testing different approaches and solutions
3. **Beta** - Building and refining the service
4. **Live** - Continuous improvement based on user feedback

## Feature Details

### LPA Application Verification

The **LPA Application Verification** prototype enables Local Planning Authority (LPA) staff to verify that developers have paid the required environmental levy before granting final planning permission.

**Key User Journey:**

1. **Landing Page** (`/lpa-verify`) - Form with application reference and developer identifier fields
2. **Verification Process** - Validates application reference format (APP-XXX) and developer details
3. **Success Page** (`/lpa-verify/details`) - Displays comprehensive application information including:
   - Application status and payment confirmation
   - Development details and environmental levy breakdown
   - Interactive map showing development site and overlapping EDP boundaries
   - Environmental Development Plan (EDP) details and rates
4. **Error Handling** (`/lpa-verify/error`) - Standard GOV.UK error page for invalid applications

**Technical Features:**

- **Form Validation** - Client and server-side validation with clear error messages
- **Fuzzy Matching** - Supports both developer names and company IDs
- **Interactive Map** - Leaflet-based map showing redline boundaries
- **Data Security** - Input sanitization and audit logging
- **Accessibility** - WCAG 2.1 AA compliant with proper ARIA labels

**Test Data Available:**

- APP-001 with "Riverside Developers Ltd" or "RDL001"
- APP-002 with "South East Properties" or "SEP002"
- APP-003 with "Hampshire Coastal Ltd" or "HCL003"

### Natural England Case Management

The **Natural England Case Management** prototype provides staff with a comprehensive interface for managing developer applications, processing payments, and maintaining audit trails.

**Key User Journey:**

1. **Dashboard** (`/case-management`) - Overview of all applications with filtering and search capabilities
2. **Application Review** (`/case-management/:id`) - Detailed view of individual applications including:
   - Development information and status
   - Payment details and environmental levy breakdown
   - Interactive map showing development and EDP boundaries
   - Audit trail and change history
3. **Application Editing** (`/case-management/:id/edit`) - Staff can update application details and status
4. **Audit Trail** (`/case-management/:id/audit`) - Complete history of all changes and actions
5. **Export Functionality** (`/case-management/export`) - CSV export of filtered application data

**Technical Features:**

- **Advanced Filtering** - Filter by status, date range, development name
- **Search and Sort** - Find applications quickly with robust search functionality
- **Status Management** - Update application status (draft, pending payment, paid, approved)
- **Payment Processing** - Track payment status and references
- **Audit Logging** - Complete audit trail with user actions and timestamps
- **Data Export** - CSV export for reporting and analysis
- **Interactive Maps** - Visual representation of development sites and EDP boundaries

**Staff Workflow:**

- **Application Review** - Staff can review submitted applications and verify details
- **Payment Verification** - Confirm environmental levy payments have been received
- **Status Updates** - Update application status as it progresses through the system
- **Audit Compliance** - Maintain complete audit trail for compliance and transparency

### User-Centered Design

All prototypes prioritize:

- **Accessibility** - Meeting WCAG 2.2 AA standards
- **Usability** - Clear, intuitive interfaces following GOV.UK patterns
- **Inclusivity** - Designing for diverse user needs and abilities
- **Efficiency** - Streamlined processes that reduce user burden

## Stakeholder Engagement

These prototypes support engagement with:

- **Internal teams** - Natural England staff and management
- **External partners** - Other government departments and delivery partners
- **Local Planning Authorities** - LPA staff who need to verify environmental levy payments
- **Potential applicants** - Landowners, farmers, and conservation organizations
- **User researchers** - Teams conducting user testing and feedback sessions

## Success Metrics

The effectiveness of these prototypes is measured by:

- User feedback and satisfaction scores
- Task completion rates in user testing
- Reduction in support queries and clarification requests
- Improved understanding of service requirements
- Faster decision-making in service design

## Related Resources

- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [Natural England](https://www.gov.uk/government/organisations/natural-england)
- [Nature Restoration Fund](https://www.gov.uk/government/publications/nature-restoration-fund)
- [GOV.UK Service Manual](https://www.gov.uk/service-manual)

## Support and Contact

For questions about these prototypes or the NRF service:

- Contact the Natural England development team
- Create an issue in this repository for specific prototype feedback
- Refer to the main [README.md](../README.md) for technical setup and deployment information
