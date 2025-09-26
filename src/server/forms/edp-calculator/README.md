# Environmental Development Plan (EDP) Levy Calculator

A complex multi-step application demonstrating custom form implementation with session management and application state tracking.

## Overview

The EDP Calculator is a custom implementation that manages multiple applications, each with different states and actions. It demonstrates patterns for complex forms that go beyond the capabilities of configuration-driven approaches.

## Features

- Multiple application management
- Hub-and-spoke navigation pattern
- Session-based application storage
- Multi-step journey with conditional routing
- Dynamic levy calculations
- Payment flow simulation
- Application status tracking

## Structure

```
edp-calculator/
├── index.js                          # Route definitions
├── controllers/
│   ├── applications-controller.js    # Applications list & new application
│   ├── location-controller.js        # Location selection
│   └── journey-controllers.js        # All journey step controllers
├── templates/
│   ├── layouts/
│   │   └── edp-form.njk             # Base layout with progress sidebar
│   ├── partials/
│   │   ├── back-link.njk            # Back navigation
│   │   ├── error-summary.njk        # Error display
│   │   ├── help-sidebar.njk         # Help content
│   │   └── progress-indicator.njk    # Progress steps
│   └── pages/
│       ├── applications.njk          # Applications list
│       ├── new-application.njk       # Start new application
│       ├── location.njk              # Location method selection
│       ├── upload-boundary.njk       # File upload option
│       ├── enter-postcode.njk        # Postcode entry
│       ├── enter-coordinates.njk     # Lat/lng entry
│       ├── draw-map.njk              # Map drawing interface
│       ├── details.njk               # Development details
│       ├── summary.njk               # Check answers
│       ├── confirmation.njk          # Application submitted
│       ├── view-application.njk      # View existing application
│       ├── payment.njk               # Payment form
│       └── payment-confirmation.njk  # Payment success
└── README.md                          # This file
```

## User Journey

### Main Flow

1. **Applications List** - View all applications with status
2. **New Application** - Start a new EDP application
3. **Location Method** - Choose how to provide location
4. **Location Input** - Enter location via chosen method
5. **Development Details** - Enter project information
6. **Summary** - Review all entered information
7. **Confirmation** - Application created successfully

### Sub-flows

- **View Application** - Review submitted application details
- **Make Payment** - Pay levy for pending applications
- **Payment Confirmation** - Payment success message

## Location Input Methods

The calculator supports four methods for specifying development location:

1. **Upload Boundary** - File upload for GIS boundary files
2. **Enter Postcode** - UK postcode validation
3. **Enter Coordinates** - Latitude/longitude validation
4. **Draw on Map** - Interactive map drawing (placeholder)

## Validation

Comprehensive server-side validation for all inputs:

### Postcode Validation

```javascript
const postcodePattern = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i
```

### Coordinates Validation

- Latitude: -90 to 90
- Longitude: -180 to 180

### Development Details

- Development name: Required, max 200 characters
- Houses count: Required, 1-10,000
- Development type: Required selection
- Wastewater site: Required selection

## Session Management

Uses @hapi/yar for session persistence:

```javascript
// Store application
const applications = request.yar.get('edpApplications') || []
applications.push(newApplication)
request.yar.set('edpApplications', applications)

// Clear journey data after submission
request.yar.clear('locationMethod')
request.yar.clear('postcode')
request.yar.clear('coordinates')
request.yar.clear('developmentDetails')
```

## Application States

Applications can have the following states:

- `pending-payment` - Awaiting levy payment
- `paid` - Payment completed
- `draft` - In progress (not implemented)
- `submitted` - Fully submitted (not implemented)

## Levy Calculation

Simple calculation based on house count:

```javascript
function calculateLevy(housesCount) {
  const levyPerHouse = 2500
  const total = housesCount * levyPerHouse
  return `£${total.toLocaleString('en-GB')}.00`
}
```

## Error Handling

Validation errors are displayed using GOV.UK patterns:

```javascript
if (errors.length > 0) {
  return h.view('template', {
    errors,
    errorList: errors,
    fieldErrors
  })
}
```

## Testing the Application

1. Navigate to http://localhost:3000/edp-calculator/applications
2. Click "Start new application"
3. Select a location method
4. Complete the location input
5. Fill in development details
6. Review on summary page
7. Submit application
8. View in applications list
9. Make payment for pending applications

## When to Use This Pattern

Use custom implementation for:

- Complex applications with multiple entities
- Hub-and-spoke navigation patterns
- Dynamic routing requirements (`/view/{id}`)
- Custom business logic
- Non-linear user journeys
- Advanced UI requirements

For simpler, linear forms, consider the configuration-driven approach shown in the [Contact Form](../contact-form/README.md).

## Future Enhancements

Potential improvements include:

- Real map integration (currently placeholder)
- File upload processing for boundary files
- Actual payment gateway integration
- Email notifications
- Application editing
- Status workflow management
- PDF generation for applications
