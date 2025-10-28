# Create Location Form Journey using Defra Forms Engine

## Journey Information

- **Journey Name**: Development Site Location Form
- **Journey Description**: A form to collect the location of a development site. Users can provide location either by entering a postcode or by drawing on a map.
- **Journey Route Prefix**: location-form
- **Start Page Title**: How would you like to provide your development site location?

## Page Flow and Conditional Logic

### Page 1: Location Method Selection

| **Field**                  | **Value**                                                                   |
| -------------------------- | --------------------------------------------------------------------------- |
| **Order number:**          | 1                                                                           |
| **Path:**                  | /location-form/how-would-you-like-to-provide-your-development-site-location |
| **Title:**                 | How would you like to provide your development site location?               |
| **Conditional page flow:** | Branches based on selection                                                 |

#### Data points

```
{
    application: {
        locationMethod: {
            type: radios
            required: true
            values: "Enter a postcode" | "Draw on a map"
        }
    }
}
```

#### Content

```
# How would you like to provide your development site location?
- Enter a postcode
- Draw on a map
```

#### Errors

| **Field**      | **Value**                                                     |
| -------------- | ------------------------------------------------------------- |
| Description:   | User has selected 'Continue' without choosing an option       |
| Error summary: | There is a problem                                            |
| Error message: | Select how you would like to provide the development location |

---

### Page 2: Enter Postcode (Conditional)

| **Field**                  | **Value**                                           |
| -------------------------- | --------------------------------------------------- |
| **Order number:**          | 2.1                                                 |
| **Path:**                  | /location-form/enter-your-development-site-postcode |
| **Title:**                 | Enter your development site postcode                |
| **Conditional page flow:** | Display if locationMethod === "Enter a postcode"    |

#### Data points

```
{
    application: {
        sitePostcode: {
            type: text
            required: conditional - required if locationMethod === "Enter a postcode"
        }
    }
}
```

#### Content

```
# Enter your development site postcode
```

#### Errors

| **Field**      | **Value**                                                |
| -------------- | -------------------------------------------------------- |
| Description:   | User has selected 'Continue' without entering a postcode |
| Error summary: | There is a problem                                       |
| Error message: | Enter a postcode                                         |
| Description:   | Invalid postcode format                                  |
| Error summary: | There is a problem                                       |
| Error message: | Enter a postcode in the correct format, like SW1A 1AA    |

---

### Page 3: Draw on Map (Conditional)

| **Field**                  | **Value**                                     |
| -------------------------- | --------------------------------------------- |
| **Order number:**          | 2.2                                           |
| **Path:**                  | /location-form/draw-development-site-boundary |
| **Title:**                 | Draw your development site boundary           |
| **Conditional page flow:** | Display if locationMethod === "Draw on a map" |

#### Data points

```
{
    application: {
        siteMapCoordinates: {
            type: text
            required: conditional - required if locationMethod === "Draw on a map"
        }
    }
}
```

#### Content

```
# Draw your development site boundary

Use the map below to draw the boundary of your development site.

Hint: Click on the map to place points and create a boundary around your site.
```

#### Errors

| **Field**      | **Value**                                             |
| -------------- | ----------------------------------------------------- |
| Description:   | User has selected 'Continue' without drawing boundary |
| Error summary: | There is a problem                                    |
| Error message: | Draw a boundary on the map to continue                |

---

### Page 4: Confirm Site Details

| **Field**                  | **Value**                           |
| -------------------------- | ----------------------------------- |
| **Order number:**          | 3                                   |
| **Path:**                  | /location-form/confirm-site-details |
| **Title:**                 | Confirm your site details           |
| **Conditional page flow:** | None                                |

#### Data points

```
{
    application: {
        siteName: {
            type: text
            required: true
        },
        siteDescription: {
            type: textarea
            required: false
        }
    }
}
```

#### Content

```
# Confirm your site details

## Site name
Enter a name for this development site

## Site description (optional)
Provide any additional details about the site
```

#### Errors

| **Field**      | **Value**                                               |
| -------------- | ------------------------------------------------------- |
| Description:   | User has selected 'Continue' without entering site name |
| Error summary: | There is a problem                                      |
| Error message: | Enter a name for the development site                   |

---

### Page 5: Check Your Answers

| **Field**                  | **Value**                         |
| -------------------------- | --------------------------------- |
| **Order number:**          | 4                                 |
| **Path:**                  | /location-form/check-your-answers |
| **Title:**                 | Check your answers                |
| **Conditional page flow:** | None                              |

#### Data points

None (summary page)

#### Content

```
# Check your answers

Display all the information collected:
- How you provided location: [Enter a postcode / Draw on a map]
- [If postcode] Postcode: [show postcode]
- [If map] Map coordinates: [show coordinates]
- Site name: [show site name]
- [If provided] Site description: [show description]
```

#### Errors

None

---

### Page 6: Confirmation

| **Field**                  | **Value**                   |
| -------------------------- | --------------------------- |
| **Order number:**          | 5                           |
| **Path:**                  | /location-form/confirmation |
| **Title:**                 | Site location submitted     |
| **Conditional page flow:** | None                        |

#### Data points

None

#### Content

```
<green banner>
# Site location submitted

Your reference number is: LOC-[generated-number]
</green banner>

## What happens next

We have saved the location details for your development site.

You can use the reference number LOC-[generated-number] to retrieve these details later.

## Contact us

If you need help, contact the planning team:

Email: planning@example.gov.uk
Telephone: 0300 123 4567
Monday to Friday, 9am to 5pm
```

#### Errors

None

---

## Technical Requirements

### Implementation Notes

This journey should be implemented using the Defra Forms Engine (@defra/forms-engine-plugin) following the V2 schema pattern.

### Key Features

1. **Conditional Routing**:

   - Based on `locationMethod` selection, show either postcode page or map page
   - Both paths merge at the "Confirm site details" page

2. **Component Types**:

   - Radio buttons for location method selection
   - Text input for postcode (with validation)
   - Text input for map coordinates (simulated for prototype)
   - Text input for site name
   - Textarea for site description

3. **Validation Requirements**:

   - All required fields must be validated
   - Postcode must match UK postcode format (basic validation)
   - Map coordinates must be provided if map option selected
   - Clear error messages for all validation failures

4. **Data Structure**:

   ```javascript
   application: {
     locationMethod: 'Enter a postcode' | 'Draw on a map',
     sitePostcode: string (conditional),
     siteMapCoordinates: string (conditional),
     siteName: string (required),
     siteDescription: string (optional)
   }
   ```

5. **Summary Page**:
   - Display all collected information
   - Show conditional fields based on location method chosen
   - Allow users to change their answers

### Form Services Required

1. **formsService.get()**:

   - Return the complete form definition with all pages
   - Include conditional logic for routing
   - Define validation rules

2. **outputService.submit()**:
   - Process the submitted form data
   - Generate a unique reference number (format: LOC-[timestamp])
   - Log the submission (in production would save to database)
   - Return confirmation details

### Expected User Flows

**Flow 1: Postcode Entry**

1. Start page → Select "Enter a postcode"
2. Enter postcode page → Enter postcode
3. Confirm site details → Enter site name and optional description
4. Check answers → Review all information
5. Confirmation → Success message with reference

**Flow 2: Map Drawing**

1. Start page → Select "Draw on a map"
2. Draw on map page → Provide map coordinates
3. Confirm site details → Enter site name and optional description
4. Check answers → Review all information
5. Confirmation → Success message with reference

## Implementation Checklist

- [ ] Create location-form-service.js with V2 schema
- [ ] Define all pages with correct paths and components
- [ ] Implement conditional logic for postcode vs map pages
- [ ] Add validation for all required fields
- [ ] Configure summary page with correct section references
- [ ] Implement form submission handler
- [ ] Register service in server.js
- [ ] Add journey to home page table
- [ ] Test postcode flow end-to-end
- [ ] Test map flow end-to-end
- [ ] Verify all error messages display correctly
- [ ] Check summary page shows correct conditional data
- [ ] Confirm submission works and displays reference number

## Notes

- For the prototype, the map drawing functionality can be simulated with a text input
- Postcode validation should be basic pattern matching (UK format)
- Focus on demonstrating the conditional routing between postcode and map options
- The reference number generation should be simple (LOC- prefix + timestamp)
- This is a simpler journey than the quote journey, making it good for testing the new-journey command
