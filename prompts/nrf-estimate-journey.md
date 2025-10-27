# NRF Estimate Journey

## Journey Information

- **Journey Name**: Nature Restoration Fund Levy Estimate and Payment
- **Journey Description**: A multi-path form journey for the Nature Restoration Fund (NRF) levy estimate and payment system. Allows users to either get an estimate for the NRF levy or make a payment (with or without an existing estimate reference).
- **Journey Slug**: nrf-estimate
- **Start Page**: Get an estimate for the Nature Restoration Fund levy

---

## Journey Types

This form supports two distinct user journeys:

1. **Estimate Journey** - Calculate and receive an estimate for the NRF levy
2. **Payment Journey** - Pay the NRF levy (can use existing estimate or create new one)

---

## Page Flow and Conditional Logic

### Page 1: Start Page

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 1                                                                  |
| **Path:**                  | /nrf-estimate/start                                                |
| **Title:**                 | Get an estimate for the Nature Restoration Fund levy              |
| **Conditional page flow:** | None                                                               |

#### Content

```markdown
# Get an estimate for the Nature Restoration Fund levy

Use this service to:
- Get an estimate for the Nature Restoration Fund levy on your development
- Make a payment for the levy

The levy applies to developments within Environmental Delivery Partner (EDP) areas.

[Start now button]
```

---

### Page 2: What Would You Like To Do (Journey Selection)

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 2                                                                  |
| **Path:**                  | /nrf-estimate/what-would-you-like-to-do                            |
| **Title:**                 | What would you like to do?                                         |
| **Conditional page flow:** | **Major branch**: estimate path vs payment path                    |

#### Data points

```javascript
{
    application: {
        journeyType: {
            type: "radios",
            required: true,
            values: "estimate" | "payment"
        }
    }
}
```

#### Content

```markdown
# What would you like to do?

- Get an estimate for the levy
- Make a payment for the levy
```

#### Routing Logic

- If `journeyType === "estimate"` → Page 7 (Redline boundary question)
- If `journeyType === "payment"` → Page 3 (Do you have estimate ref)

#### Errors

| **Field**      | **Value**                                |
| -------------- | ---------------------------------------- |
| Description:   | No option selected                       |
| Error message: | Select what you would like to do         |

---

## PAYMENT JOURNEY BRANCH

### Page 3: Do You Have an Estimate Reference

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 3                                                                  |
| **Path:**                  | /nrf-estimate/do-you-have-an-estimate-ref                          |
| **Title:**                 | Do you have an estimate reference?                                 |
| **Conditional page flow:** | Only shown if `journeyType === "payment"`                          |

#### Data points

```javascript
{
    application: {
        hasEstimateRef: {
            type: "radios",
            required: true,
            values: "yes" | "no"
        }
    }
}
```

#### Content

```markdown
# Do you have an estimate reference?

This is a reference number starting with EST- that was sent to you by email

- Yes
- No
```

#### Routing Logic

- If `hasEstimateRef === "yes"` → Page 4 (Enter estimate ref)
- If `hasEstimateRef === "no"` → Page 7 (Redline boundary - joins estimate journey)

#### Errors

| **Field**      | **Value**                                           |
| -------------- | --------------------------------------------------- |
| Description:   | No option selected                                  |
| Error message: | Select yes if you have an estimate reference        |

---

### Page 4: Enter Your Estimate Reference

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 4                                                                  |
| **Path:**                  | /nrf-estimate/enter-estimate-ref                                   |
| **Title:**                 | Enter your estimate reference                                      |
| **Conditional page flow:** | Only shown if `hasEstimateRef === "yes"`                           |

#### Data points

```javascript
{
    application: {
        estimateRef: {
            type: "text",
            required: true
        }
    }
}
```

#### Content

```markdown
# Enter your estimate reference

This is a 6-digit number that starts with EST-, for example EST-123456
```

#### Errors

| **Field**      | **Value**                                      |
| -------------- | ---------------------------------------------- |
| Description:   | Field empty                                    |
| Error message: | Enter your estimate reference to continue      |
| Description:   | Non-numeric value                              |
| Error message: | Enter a valid estimate reference number        |

---

### Page 5: Retrieve Estimate Email

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 5                                                                  |
| **Path:**                  | /nrf-estimate/retrieve-estimate-email                              |
| **Title:**                 | Enter the email address you used for your estimate                 |
| **Conditional page flow:** | Only shown after entering estimate ref                             |

#### Data points

```javascript
{
    application: {
        email: {
            type: "email",
            required: true
        }
    }
}
```

#### Content

```markdown
# Enter the email address you used for your estimate

We'll send a link to your estimate so you can proceed with payment
```

#### Errors

| **Field**      | **Value**                                                        |
| -------------- | ---------------------------------------------------------------- |
| Description:   | Field empty                                                      |
| Error message: | Enter your email address to continue                             |
| Description:   | Invalid format                                                   |
| Error message: | Enter an email address in the correct format, like name@example.com |
| Description:   | Too long                                                         |
| Error message: | Email address must not exceed 256 characters                     |

---

### Page 6: Estimate Email Retrieval Content

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 6                                                                  |
| **Path:**                  | /nrf-estimate/estimate-email-retrieval-content                     |
| **Title:**                 | We've sent you an email                                            |
| **Conditional page flow:** | Information page                                                   |

#### Content

```markdown
# We've sent you an email

Check your email inbox for a message from the Nature Restoration Fund service.

Click the link in the email to retrieve your estimate and continue with payment.

The link will expire in 24 hours.

[Continue to planning reference button]
```

**Note:** This simulates the magic link flow. In production, this would trigger an email with a secure link.

---

## CORE DATA COLLECTION (BOTH JOURNEYS)

### Page 7: Do You Have a Red Line Boundary File

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 7                                                                  |
| **Path:**                  | /nrf-estimate/redline-map                                          |
| **Title:**                 | Do you have a red line boundary file for your development?         |
| **Conditional page flow:** | Branches to upload or manual entry                                 |

#### Data points

```javascript
{
    application: {
        hasRedlineBoundaryFile: {
            type: "radios",
            required: true,
            values: "yes" | "no"
        }
    }
}
```

#### Content

```markdown
# Do you have a red line boundary file for your development?

A red line boundary file is a geographic file (such as .shp or .geojson) that defines the boundary of your development site.

- Yes, I have a red line boundary file
- No, I will enter the boundary another way
```

#### Routing Logic

- If `hasRedlineBoundaryFile === "yes"` → Page 8 (Upload file)
- If `hasRedlineBoundaryFile === "no"` → Page 9 (Define boundary)

#### Errors

| **Field**      | **Value**                                              |
| -------------- | ------------------------------------------------------ |
| Description:   | No option selected                                     |
| Error message: | Select yes if you have a red line boundary file        |

---

### Page 8: Upload Red Line Boundary File

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 8                                                                  |
| **Path:**                  | /nrf-estimate/upload-redline                                       |
| **Title:**                 | Upload your red line boundary file                                 |
| **Conditional page flow:** | Only if `hasRedlineBoundaryFile === "yes"`                         |
| **Controller:**            | FileUploadPageController                                           |

#### Data points

```javascript
{
    application: {
        redlineFile: {
            type: "file",
            required: true,
            acceptedTypes: [".shp", ".geojson"],
            maxSize: 2097152 // 2MB in bytes
        },
        redlineBoundaryPolygon: {
            type: "object", // Parsed from uploaded file
            internal: true  // Not displayed to user
        }
    }
}
```

#### Content

```markdown
# Upload your red line boundary file

The file must be a .shp or .geojson file and smaller than 2MB
```

#### Errors

| **Field**      | **Value**                                                   |
| -------------- | ----------------------------------------------------------- |
| Description:   | No file selected                                            |
| Error message: | Select a file                                               |
| Description:   | Wrong file type                                             |
| Error message: | The selected file must be a .shp or .geojson file           |
| Description:   | File too large                                              |
| Error message: | The selected file must be smaller than 2MB                  |
| Description:   | Empty file                                                  |
| Error message: | The selected file is empty                                  |
| Description:   | Invalid GeoJSON                                             |
| Error message: | The selected file is not a valid GeoJSON file               |
| Description:   | No coordinates                                              |
| Error message: | The GeoJSON file does not contain valid polygon coordinates |

#### Implementation Notes

- Use FileUploadPageController from DEFRA Forms
- Configure multer with memory storage and 2MB limit
- Parse GeoJSON to extract polygon coordinates
- Handle FeatureCollection, Feature, Polygon, and MultiPolygon geometry types
- Store filename in `redlineFile` and parsed coordinates in `redlineBoundaryPolygon`
- For .shp files: Show error "Shapefile parsing is not yet supported. Please use GeoJSON format."

---

### Page 9: Define Boundary on Map

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 9                                                                  |
| **Path:**                  | /nrf-estimate/map                                                  |
| **Title:**                 | Enter your development site boundary coordinates                   |
| **Conditional page flow:** | Shown if no file uploaded or after file upload for confirmation    |

#### Data points

```javascript
{
    application: {
        boundaryData: {
            type: "text",
            required: true
        },
        redlineBoundaryPolygon: {
            type: "object",
            internal: true
        }
    }
}
```

#### Content

```markdown
# Enter your development site boundary coordinates

Enter the center coordinates of your development site in the format: longitude, latitude

For example: -0.4, 51.5

**Note:** For the prototype, this is a simplified text input. In production, this would be an interactive Leaflet map with drawing tools.
```

#### Routing Logic

After submission:
- Parse and validate coordinates
- Check if coordinates intersect with EDP boundaries
- If NO intersection → Page 10 (No EDP area - terminal)
- If intersection found → Page 11 (Building types)
- If coming from summary (`?nav=summary`) → Back to summary

#### Errors

| **Field**      | **Value**                                      |
| -------------- | ---------------------------------------------- |
| Description:   | Field empty                                    |
| Error message: | Enter boundary coordinates to continue         |
| Description:   | Invalid format                                 |
| Error message: | Enter coordinates in the correct format        |

---

### Page 10: No EDP Area (Terminal)

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 10                                                                 |
| **Path:**                  | /nrf-estimate/no-edp                                               |
| **Title:**                 | Your development is not in an Environmental Delivery Partner area  |
| **Conditional page flow:** | Terminal page - journey ends here                                  |

#### Content

```markdown
# Your development is not in an Environmental Delivery Partner area

The boundary you provided does not intersect with any Environmental Delivery Partner (EDP) areas.

The Nature Restoration Fund levy only applies to developments within EDP areas.

You may need to check your boundary coordinates.

[Return to map to re-enter boundary]
```

---

### Page 11: Select Building Types

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 11                                                                 |
| **Path:**                  | /nrf-estimate/building-type                                        |
| **Title:**                 | What types of buildings are part of your development?              |
| **Conditional page flow:** | **Complex multi-branch** based on selections                       |

#### Data points

```javascript
{
    application: {
        buildingTypes: {
            type: "checkboxes",
            required: true,
            multiple: true,
            values: [
                "Dwellinghouse",
                "Hotel",
                "House of multiple occupation (HMO)",
                "Residential institution",
                "Non-residential development"
            ]
        }
    }
}
```

#### Content

```markdown
# What types of buildings are part of your development?

Select all that apply

- Dwellinghouse
- Hotel
- House of multiple occupation (HMO)
- Residential institution (such as care homes, boarding schools)
- Non-residential development
```

#### Routing Logic (Complex)

**Priority order:**

1. If "Non-residential development" selected → Page 12 (Info page - terminal)
2. Else if any of [Hotel, HMO, Residential institution] selected:
   - Store these in `roomCountTypes` array
   - Set `currentRoomCountIndex = 0`
   - → Page 13 (Room count - iterative)
3. Else if "Dwellinghouse" selected → Page 14 (Residential count)
4. Else → Jump to email or planning ref (determined by journey type)

**When changing from summary (`?change=true&nav=summary`):**
- Compare new selections with previous
- Clear data for removed building types
- Collect data for newly added building types
- Return to summary if no new data needed

#### Errors

| **Field**      | **Value**                                  |
| -------------- | ------------------------------------------ |
| Description:   | No checkboxes selected                     |
| Error message: | Select a building type to continue         |

---

### Page 12: Non-Residential Development (Terminal)

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 12                                                                 |
| **Path:**                  | /nrf-estimate/non-residential                                      |
| **Title:**                 | Non-residential developments                                       |
| **Conditional page flow:** | Terminal page                                                      |

#### Content

```markdown
# Non-residential developments

Non-residential developments have different levy calculation requirements.

You will need to contact your Environmental Delivery Partner directly for guidance on your levy estimate.
```

---

### Page 13: Room Count (Multi-Step Iterative)

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 13                                                                 |
| **Path:**                  | /nrf-estimate/room-count                                           |
| **Title:**                 | How many rooms are in your [building type]?                        |
| **Conditional page flow:** | **Iterates** for each building type requiring room counts          |

#### Data points

```javascript
{
    application: {
        roomCount: {
            type: "number",
            required: true,
            min: 1
        },
        roomCounts: {
            type: "object",
            internal: true,
            properties: {
                hotelCount: "number",
                hmoCount: "number",
                residentialInstitutionCount: "number"
            }
        },
        roomCountTypes: {
            type: "array",
            internal: true // Tracks which types need counts
        },
        currentRoomCountIndex: {
            type: "number",
            internal: true // Tracks iteration progress
        }
    }
}
```

#### Content

```markdown
# How many rooms are in your [building type]?

**Step X of Y** (show progress)

**Hints by type:**
- Hotel: Enter the total number of guest rooms
- HMO: Enter the total number of bedrooms available for rent
- Residential institution: Enter the total number of resident rooms or beds
```

#### Implementation Logic

This page implements a **multi-step iteration pattern**:

1. On first visit: `currentRoomCountIndex = 0`
2. Display question for `roomCountTypes[currentRoomCountIndex]`
3. On submit: Store count in appropriate field in `roomCounts` object
4. Increment `currentRoomCountIndex`
5. If more types remain: Re-render this page for next type
6. If all types processed: Continue to next step in journey

**Mapping building types to data keys:**
```javascript
{
  'Hotel': 'hotelCount',
  'House of multiple occupation (HMO)': 'hmoCount',
  'Residential institution': 'residentialInstitutionCount'
}
```

**Next step after all room counts collected:**
- If `buildingTypes` includes "Dwellinghouse" → Page 14 (Residential count)
- Else if from summary with changes → Back to summary
- Else → Page 15 (Email) or Page 16 (Planning ref) based on journey type

#### Errors

| **Field**      | **Value**                                  |
| -------------- | ------------------------------------------ |
| Description:   | Field empty or invalid                     |
| Error message: | Enter the number of rooms to continue      |

---

### Page 14: Residential Building Count

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 14                                                                 |
| **Path:**                  | /nrf-estimate/residential                                          |
| **Title:**                 | How many dwellinghouse buildings are part of your development?     |
| **Conditional page flow:** | Only if "Dwellinghouse" selected                                   |

#### Data points

```javascript
{
    application: {
        residentialBuildingCount: {
            type: "number",
            required: true,
            min: 1
        }
    }
}
```

#### Content

```markdown
# How many dwellinghouse buildings are part of your development?

Enter the total number of separate dwellinghouse structures
```

#### Routing Logic

- If from summary (`?change=true&nav=summary`) → Back to summary
- Else → Determined by `getNextRouteAfterBuildingDetails()` helper:
  - Payment journey without estimate ref → Page 16 (Planning ref)
  - Otherwise → Page 15 (Email)

#### Errors

| **Field**      | **Value**                                                        |
| -------------- | ---------------------------------------------------------------- |
| Description:   | Field empty or invalid                                           |
| Error message: | Enter the number of dwellinghouse buildings to continue          |

---

### Page 15: Email Address

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 15                                                                 |
| **Path:**                  | /nrf-estimate/email                                                |
| **Title:**                 | What is your email address?                                        |
| **Conditional page flow:** | Appears in most journeys before summary                            |

#### Data points

```javascript
{
    application: {
        email: {
            type: "email",
            required: true,
            maxLength: 256
        }
    }
}
```

#### Content

```markdown
# What is your email address?

We'll send your estimate reference and details to this email address
```

#### Routing Logic

- Always goes to Page 17 (Summary) after submission

**Back link varies by journey:**
- Payment without estimate ref → Page 16 (Planning ref)
- Otherwise → Last building details page collected

#### Errors

| **Field**      | **Value**                                                        |
| -------------- | ---------------------------------------------------------------- |
| Description:   | Field empty                                                      |
| Error message: | Enter your email address                                         |
| Description:   | Invalid format                                                   |
| Error message: | Enter an email address in the correct format, like name@example.com |
| Description:   | Too long                                                         |
| Error message: | Email address must not exceed 256 characters                     |

---

### Page 16: Planning Application Reference

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 16                                                                 |
| **Path:**                  | /nrf-estimate/planning-ref                                         |
| **Title:**                 | What is the planning application reference?                        |
| **Conditional page flow:** | **Only for payment journey without estimate ref**                  |

#### Data points

```javascript
{
    application: {
        planningRef: {
            type: "text",
            required: true
        }
    }
}
```

#### Content

```markdown
# What is the planning application reference?

This is the unique reference number for your planning application, for example PLAN/2024/001
```

#### Routing Logic

- If from summary (`?change=true&nav=summary`) → Back to summary
- Else if payment journey without estimate ref → Page 15 (Email)
- Else → Page 17 (Summary)

**Back link logic:**
- Payment without estimate ref → Last building details page
- Otherwise → Page 6 (Estimate email retrieval content)

#### Errors

| **Field**      | **Value**                                      |
| -------------- | ---------------------------------------------- |
| Description:   | Field empty                                    |
| Error message: | Enter the planning application reference       |

---

### Page 17: Check Your Answers (Summary)

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 17                                                                 |
| **Path:**                  | /nrf-estimate/summary                                              |
| **Title:**                 | Check your answers (varies by journey type)                        |
| **Conditional page flow:** | **Conditional template** based on journey type                     |
| **Controller:**            | SummaryPageController                                              |

#### Content

**Heading varies:**
- Estimate journey: "Check your answers before getting your estimate"
- Payment journey: "Check your answers before making payment"

**Summary Sections:**

**Development Boundary:**
- Development site boundary → "Defined" or show coordinates → Change link: `/nrf-estimate/map?change=true&nav=summary`
- (If uploaded file) Boundary file → `{redlineFile}` → Change link: `/nrf-estimate/upload-redline?change=true&nav=summary`

**Building Details:**
- Building types → List of selected types → Change link: `/nrf-estimate/building-type?change=true&nav=summary`
- (If Dwellinghouse) Number of dwellinghouses → `{count}` → Change: `/nrf-estimate/residential?change=true&nav=summary`
- (If Hotel) Hotel rooms → `{count}` → Change: `/nrf-estimate/room-count?change=true&nav=summary&type=hotel`
- (If HMO) HMO rooms → `{count}` → Change: `/nrf-estimate/room-count?change=true&nav=summary&type=hmo`
- (If Residential institution) Residential institution rooms → `{count}` → Change: `/nrf-estimate/room-count?change=true&nav=summary&type=residential-institution`

**Contact Details:**
- Email address → `{email}` → Change: `/nrf-estimate/email?change=true&nav=summary`
- (If payment) Planning reference → `{planningRef}` → Change: `/nrf-estimate/planning-ref?change=true&nav=summary`

**Button text varies:**
- Estimate journey: "Get estimate"
- Payment journey: "Continue to payment"

#### Submission Logic

**On POST:**
- Estimate journey:
  - Generate `estimateReference` = 'EST-' + Date.now().toString().slice(-6)
  - Store in session
  - Redirect to Page 18 (Estimate confirmation)

- Payment journey:
  - Generate `paymentReference` = 'PAY-' + Date.now().toString().slice(-6)
  - Store in session
  - Redirect to Page 19 (Payment confirmation)

#### Validation

Before rendering:
- Estimate journey: Must have `email`
- Payment journey: Must have `planningRef`
- If missing → Redirect to appropriate collection page

---

### Page 18: Estimate Confirmation

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 18                                                                 |
| **Path:**                  | /nrf-estimate/confirmation                                         |
| **Title:**                 | Estimate created                                                   |
| **Conditional page flow:** | Terminal page for estimate journey                                 |

#### Content

```markdown
<gov-uk-panel title="Estimate created">
  Your estimate reference is
  {estimateReference}
</gov-uk-panel>

We have sent your estimate details to {email}

Your estimate is valid for 30 days

## What happens next

- Review your estimate in the email we sent you
- If you're ready to pay, you can return to this service and use your estimate reference
- If you have questions, contact your Environmental Delivery Partner

[View what the email looks like] (link to /nrf-estimate/estimate-email-content)

[What did you think of this service?] (feedback link)
```

---

### Page 19: Payment Confirmation

| **Field**                  | **Value**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Order number:**          | 19                                                                 |
| **Path:**                  | /nrf-estimate/payment-confirmation                                 |
| **Title:**                 | Payment complete                                                   |
| **Conditional page flow:** | Terminal page for payment journey                                  |

#### Content

```markdown
<gov-uk-panel title="Payment complete">
  Your payment reference is
  {paymentReference}
</gov-uk-panel>

We have sent your payment confirmation to {email}

## What happens next

- Your payment will be processed within 2 working days
- You will receive a receipt by email
- Your Environmental Delivery Partner will be notified

[What did you think of this service?] (feedback link)
```

---

## Technical Requirements

### Session Data Structure

All data stored in `req.session.data`:

```javascript
{
  // Journey control
  journeyType: 'estimate' | 'payment',
  hasEstimateRef: 'yes' | 'no',
  estimateRef: string,

  // Boundary data
  hasRedlineBoundaryFile: 'yes' | 'no',
  redlineFile: string,
  redlineBoundaryPolygon: {
    center: [longitude, latitude],
    coordinates: [[lng, lat], ...],
    intersectingCatchment: string
  },
  mapReferrer: 'upload-redline' | 'redline-map', // Internal tracking

  // Building data
  buildingTypes: string[], // Array of selected building types
  roomCountTypes: string[], // Internal: types needing room counts
  currentRoomCountIndex: number, // Internal: iteration tracking
  roomCounts: {
    hotelCount: number,
    hmoCount: number,
    residentialInstitutionCount: number
  },
  residentialBuildingCount: number,

  // Contact data
  email: string,
  planningRef: string,

  // Generated references
  estimateReference: string,
  paymentReference: string
}
```

### Helper Functions Required

#### getNextRouteAfterBuildingDetails(sessionData)

Determines next route after all building details collected.

```javascript
function getNextRouteAfterBuildingDetails(sessionData) {
  if (sessionData.journeyType === 'payment' &&
      sessionData.hasEstimateRef === 'no') {
    return '/nrf-estimate/planning-ref'
  }
  return '/nrf-estimate/email'
}
```

#### normalizeBuildingTypes(buildingTypes)

Ensures building types is always an array.

```javascript
function normalizeBuildingTypes(buildingTypes) {
  if (Array.isArray(buildingTypes)) return buildingTypes
  if (buildingTypes && buildingTypes !== '_unchecked') return [buildingTypes]
  return []
}
```

#### getRemovedBuildingTypes(previous, current)

Returns building types that were removed (for cleanup).

```javascript
function getRemovedBuildingTypes(previous, current) {
  return previous.filter(type => !current.includes(type))
}
```

#### getNewlyAddedBuildingTypes(previous, current)

Returns building types that were newly added (need data collection).

```javascript
function getNewlyAddedBuildingTypes(previous, current) {
  return current.filter(type => !previous.includes(type))
}
```

### Constants

```javascript
const BUILDING_TYPES = {
  DWELLINGHOUSE: 'Dwellinghouse',
  HOTEL: 'Hotel',
  HMO: 'House of multiple occupation (HMO)',
  RESIDENTIAL_INSTITUTION: 'Residential institution',
  NON_RESIDENTIAL: 'Non-residential development'
}

const BUILDING_TYPES_REQUIRING_ROOM_COUNT = [
  'Hotel',
  'House of multiple occupation (HMO)',
  'Residential institution'
]

const BUILDING_TYPE_DATA_KEYS = {
  'hmo': 'hmoCount',
  'hotel': 'hotelCount',
  'residential-institution': 'residentialInstitutionCount'
}
```

### File Upload Configuration

- Use `FileUploadPageController` from DEFRA Forms
- Configure multer:
  - Storage: `multer.memoryStorage()`
  - File size limit: 2MB (2 * 1024 * 1024 bytes)
- Accepted types: `.shp`, `.geojson`
- Parse GeoJSON to extract coordinates (handle FeatureCollection, Feature, Polygon, MultiPolygon)

### GeoJSON Parsing

Extract coordinates from various GeoJSON structures:

```javascript
// Handle different GeoJSON types
if (geojson.type === 'FeatureCollection') {
  coordinates = geojson.features[0].geometry.coordinates[0]
} else if (geojson.type === 'Feature') {
  coordinates = geojson.geometry.coordinates[0]
} else if (geojson.type === 'Polygon') {
  coordinates = geojson.coordinates[0]
} else if (geojson.type === 'MultiPolygon') {
  coordinates = geojson.coordinates[0][0]
}
```

### Change Flow from Summary

All change links include query parameters:
- `?change=true` - Indicates edit operation
- `&nav=summary` - Return destination
- `&type={key}` - For specific room count edits

**Change handling logic:**
1. Render page with existing data pre-filled
2. On submission, update only changed field
3. Handle cascade effects (e.g., removing building type clears counts)
4. For building types, collect data for newly added types before returning
5. Redirect back to summary with all data preserved

---

## Expected User Flows

### Flow 1: Estimate Journey - Simple Dwellinghouse

1. Start → Click "Start now"
2. What would you like to do → Select "Get an estimate"
3. Redline boundary → Select "No" (no file)
4. Define boundary → Enter coordinates
5. Building types → Select "Dwellinghouse" only
6. Residential count → Enter number of houses
7. Email → Enter email address
8. Summary → Review all details
9. Confirmation → See estimate reference

### Flow 2: Estimate Journey - Complex Multi-Building

1. Start → Click "Start now"
2. What would you like to do → Select "Get an estimate"
3. Redline boundary → Select "Yes" (have file)
4. Upload file → Upload GeoJSON
5. Map confirmation → Confirm or adjust boundary
6. Building types → Select "Hotel", "HMO", "Dwellinghouse"
7. Room count (Hotel) → Enter hotel room count
8. Room count (HMO) → Enter HMO room count
9. Residential count → Enter dwellinghouse count
10. Email → Enter email address
11. Summary → Review all details
12. Confirmation → See estimate reference

### Flow 3: Payment Journey - With Estimate Reference

1. Start → Click "Start now"
2. What would you like to do → Select "Make a payment"
3. Do you have estimate ref → Select "Yes"
4. Enter estimate ref → Enter EST-123456
5. Retrieve estimate email → Enter email
6. Email sent → Click continue
7. Planning ref → Enter planning reference
8. Summary → Review all details
9. Payment confirmation → See payment reference

### Flow 4: Payment Journey - Without Estimate Reference

1. Start → Click "Start now"
2. What would you like to do → Select "Make a payment"
3. Do you have estimate ref → Select "No"
4. [Joins estimate flow] Redline boundary → Define boundary
5. Building types → Select building types
6. [Collect building details] → Room counts/residential count
7. Planning ref → Enter planning reference
8. Email → Enter email address
9. Summary → Review all details
10. Payment confirmation → See payment reference

### Flow 5: Change from Summary

1. [Complete any journey to summary]
2. Summary → Click "Change" on building types
3. Building types → Add "Hotel"
4. Room count (Hotel) → Enter room count
5. Summary → Back to summary with updated data
6. Summary → Click "Change" on email
7. Email → Update email address
8. Summary → Back to summary
9. Summary → Submit

---

## Implementation Checklist

- [ ] Create nrf-estimate-service.js with form definition
- [ ] Define all route paths with slug prefix
- [ ] Create Page 1-2: Start and journey selection
- [ ] Create Pages 3-6: Payment journey branch
- [ ] Create Pages 7-10: Boundary collection (file upload + manual)
- [ ] Create Pages 11-14: Building type selection and details collection
- [ ] Implement multi-step room count iteration logic
- [ ] Create Pages 15-16: Email and planning ref
- [ ] Create Page 17: Summary page with conditional display
- [ ] Create Pages 18-19: Confirmation pages
- [ ] Implement all helper functions
- [ ] Implement file upload with GeoJSON parsing
- [ ] Implement conditional routing logic
- [ ] Implement change flow from summary
- [ ] Configure all validations and error messages
- [ ] Register service in server.js
- [ ] Add link to home page
- [ ] Test estimate journey end-to-end
- [ ] Test payment journey with estimate ref
- [ ] Test payment journey without estimate ref
- [ ] Test all change links from summary
- [ ] Test file upload functionality
- [ ] Verify all validation messages
- [ ] Test terminal pages (non-residential, no EDP)

---

## Success Criteria

✅ Server starts without errors
✅ Both journey types accessible from start page
✅ Estimate journey completes successfully
✅ Payment journey with estimate ref completes successfully
✅ Payment journey without estimate ref completes successfully
✅ File upload works for GeoJSON files
✅ Conditional routing works correctly
✅ Multi-step room count iteration works
✅ Change links from summary work correctly
✅ All validation displays properly
✅ Summary displays correct data based on journey
✅ Confirmation pages display with references
✅ Terminal pages (non-residential, no EDP) work

---

## Notes for Implementation

- **Map simplification**: Use text input for coordinates instead of interactive map
- **File upload**: Use FileUploadPageController with GeoJSON parsing
- **Multi-step pattern**: Room count page iterates using session tracking
- **Conditional templates**: Summary page renders differently for estimate vs payment
- **Change flow**: All fields support change links with proper data cleanup
- **Terminal pages**: Non-residential and No EDP end the journey
- **Reference generation**: Simple timestamp-based references (EST-/PAY- prefix)
- **Session management**: All data in req.session.data with explicit saves before redirects
- **Validation**: Client and server-side validation for all fields
- **Back links**: Dynamically calculated based on journey path taken

This is the most complex journey in the system due to:
- Multiple journey types
- Extensive conditional routing
- Multi-step iteration (room counts)
- File upload with parsing
- Change flow from summary
- Data cleanup on changes
