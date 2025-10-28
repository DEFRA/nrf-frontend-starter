# Critical Implementation Requirements

This document outlines critical requirements that MUST be implemented for 100% specification compliance. These requirements were identified through content review and are essential for production-ready journeys.

## Back Links Implementation

**Issue**: No pages have back links implemented, causing poor navigation.

**Required Implementation**:

```javascript
// Controller - Add back link to context
export const getPageController = {
  handler(request, h) {
    return h.view('journey-name/page', {
      pageTitle: 'Page Title',
      backLink: ROUTES.PREVIOUS_PAGE // Calculate conditionally if needed
    })
  }
}
```

**Template Implementation**:

```njk
{% extends 'layouts/page.njk' %}
{% from "govuk/components/back-link/macro.njk" import govukBackLink %}

{% block beforeContent %}
  {{ govukBackLink({ href: backLink }) }}
{% endblock %}

{% block content %}
  <!-- Page content -->
{% endblock %}
```

**Rules**:

- Every page except start must have a back link
- Back links must point to the correct previous page
- Use conditional logic for different journey paths

## Change Links on Summary Page

**Issue**: Summary page has no change links, preventing users from modifying answers.

**Required Implementation**:

```javascript
// Controller - Pass ROUTES object (not string!)
export const getSummaryController = {
  handler(request, h) {
    return h.view('journey-name/summary', {
      pageTitle: 'Check your answers',
      fieldValue: request.yar.get('field'),
      ROUTES // Pass entire ROUTES object
    })
  }
}
```

**Template Implementation**:

```njk
{% from "govuk/components/summary-list/macro.njk" import govukSummaryList %}

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

**Rules**:

- Summary controller must pass ROUTES object to template
- Summary template must use ROUTES.FIELD_PAGE in change links
- Change links must have proper visuallyHiddenText for accessibility
- All fields must have change links

## Template Path Requirements

**Issue**: Using incorrect template paths in `h.view()` calls causes 500 Internal Server Error.

**Required Implementation**:

```javascript
// ❌ NEVER use incorrect template paths
return h.view('start', { ... })
return h.view('summary', { ... })

// ✅ ALWAYS use journey name prefix
return h.view('nrf-estimate-1/start', { ... })
return h.view('nrf-estimate-1/summary', { ... })
```

**Template Path Rules**:

- Always use `{journey-name}/{template-name}` format
- Journey name must match the directory name in `src/server/forms/`
- Template name must match the `.njk` file name (without extension)

## Planning Reference Field for Payment Journeys

**Issue**: Users selecting "I have a planning reference and I'm ready to pay" cannot provide their planning reference.

**Required Implementation**:

```javascript
// Add to routes.js
PLANNING_REFERENCE: '/journey/planning-reference'

// Add conditional routing in controller
export const postWhatWouldYouLikeToDoController = {
  handler(request, h) {
    const { journeyType } = request.payload
    request.yar.set('application', { journeyType })

    if (journeyType === 'payment') {
      return h.redirect(ROUTES.PLANNING_REFERENCE) // Required!
    }
    return h.redirect(ROUTES.NEXT_PAGE)
  }
}

// Planning reference controller
export const postPlanningReferenceController = {
  handler(request, h) {
    const { planningReference } = request.payload

    if (!planningReference) {
      request.yar.flash('error', 'Enter your planning reference to continue')
      return h.redirect(ROUTES.PLANNING_REFERENCE)
    }

    request.yar.set('application', {
      ...request.yar.get('application', {}),
      planningReference
    })

    return h.redirect(ROUTES.NEXT_PAGE)
  }
}
```

**Template**:

```njk
{% extends 'layouts/page.njk' %}
{% from "govuk/components/input/macro.njk" import govukInput %}
{% from "govuk/components/button/macro.njk" import govukButton %}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-xl">Enter your planning reference</h1>

      <form method="post" novalidate>
        {{ govukInput({
          id: "planningReference",
          name: "planningReference",
          label: {
            text: "Planning reference"
          },
          hint: {
            text: "This is the reference number from your planning application"
          },
          errorMessage: { text: error } if error
        }) }}

        {{ govukButton({
          text: "Continue"
        }) }}
      </form>
    </div>
  </div>
{% endblock %}
```

## Production Content Requirements

**Issue**: All contact details use placeholders that must be replaced before production.

**Required Replacements**:

```javascript
// ❌ NEVER ship with placeholder content
const contactInfo = {
  name: 'XXXX', // Replace with real contact name
  email: 'xxxxx@defra.gov.uk', // Replace with real email
  phone: '00000000000' // Replace with real phone
}

// ✅ Use real production values
const contactInfo = {
  name: 'Natural England Support',
  email: 'nrf-support@naturalengland.org.uk',
  phone: '0300 060 3900'
}
```

**Locations to Update**:

- All view templates with contact information
- Email templates
- Error pages
- Help text

## EDP Boundary Validation

**Issue**: Controller uses hardcoded `isWithinEDP = true` instead of real boundary validation.

**Required Implementation**:

```javascript
// ❌ Never use hardcoded validation
const isWithinEDP = true // Placeholder

// ✅ Implement real boundary validation
const isWithinEDP = await checkEDPBoundary(redlineBoundaryPolygon)
if (!isWithinEDP) {
  return h.redirect(ROUTES.NO_EDP)
}
```

**Implementation Notes**:

- Replace hardcoded validation with actual EDP boundary checking
- Add EDP area name mapping for email content
- Implement proper error handling for boundary validation failures

## Admin Charge Amount

**Issue**: Email template shows "£00" for admin charge.

**Required Fix**:

```javascript
// Update admin charge amount in email templates
const adminCharge = '25' // Replace with actual admin charge amount
```

## Template Path Requirements

**Issue**: Using incorrect template paths in `h.view()` calls causes 500 Internal Server Error.

**Required Implementation**:

```javascript
// ❌ NEVER use incorrect template paths
return h.view('start', { ... })
return h.view('summary', { ... })

// ✅ ALWAYS use journey name prefix
return h.view('nrf-estimate-1/start', { ... })
return h.view('nrf-estimate-1/summary', { ... })
```

**Template Path Rules**:

- Always use `{journey-name}/{template-name}` format
- Journey name must match the directory name in `src/server/forms/`
- Template name must match the `.njk` file name (without extension)

## File Upload Validation

**Issue**: File upload validation may be incomplete.

**Required Implementation**:

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

## Validation Checklist

Before considering a journey complete, verify:

### Critical Implementation Patterns

- [ ] **Back Links**: All pages except start have back links implemented
- [ ] **Change Links**: Summary page has change links with ROUTES object passed
- [ ] **Template Paths**: All h.view() calls use correct journey-name/template format
- [ ] **Session Management**: POST controllers use request.yar.set(), GET controllers use request.yar.get()
- [ ] **Error Handling**: Proper error patterns with request.yar.flash()

### Content Requirements

- [ ] Planning reference field implemented for payment journeys
- [ ] All placeholder contact information replaced with real values
- [ ] EDP boundary validation uses real logic (not hardcoded)
- [ ] Admin charge amounts show actual values (not £00)
- [ ] File upload validation includes all error scenarios from spec
- [ ] Dynamic content uses actual session data (not static values)

### Technical Implementation

- [ ] All template paths use journey-name prefix (prevents 500 errors)
- [ ] Summary controller passes ROUTES object to template
- [ ] Change links have proper visuallyHiddenText for accessibility
- [ ] Back links point to correct previous page
- [ ] Conditional routing logic implemented correctly

## Integration with Content Review

This document is referenced by the `/content-review` command to ensure these critical requirements are validated during implementation review.

Use the content review command to verify compliance:

```
/content-review journey:[journey-name] spec-file:[specification-path]
```
