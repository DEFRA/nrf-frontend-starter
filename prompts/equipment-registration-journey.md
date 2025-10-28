# Equipment Registration Form Journey

## Journey Information

- **Journey Name**: Agricultural Equipment Registration
- **Journey Description**: A form to register agricultural equipment for subsidy purposes. Users can register either new or used equipment with different information requirements.
- **Journey Slug**: equipment-registration
- **Start Page**: What type of equipment are you registering?

---

## Page Flow and Conditional Logic

### Page 1: Equipment Type Selection (Branching Point)

| **Field**                  | **Value**                                   |
| -------------------------- | ------------------------------------------- |
| **Order number:**          | 1                                           |
| **Path:**                  | /what-type-of-equipment-are-you-registering |
| **Title:**                 | What type of equipment are you registering? |
| **Conditional page flow:** | Branches based on equipment type selection  |

#### Data points

```javascript
{
    application: {
        equipmentType: {
            type: "radios",
            required: true,
            values: "New equipment" | "Used equipment"
        }
    }
}
```

#### Content

```markdown
# What type of equipment are you registering?

Select whether you are registering new or used equipment.

- New equipment
- Used equipment
```

#### Errors

| **Field**      | **Value**                                                |
| -------------- | -------------------------------------------------------- |
| Description:   | User clicked Continue without selecting an option        |
| Error summary: | There is a problem                                       |
| Error message: | Select whether you are registering new or used equipment |

---

### Page 2.1: New Equipment Details (Conditional)

| **Field**                  | **Value**                                         |
| -------------------------- | ------------------------------------------------- |
| **Order number:**          | 2.1                                               |
| **Path:**                  | /new-equipment-purchase-details                   |
| **Title:**                 | New equipment purchase details                    |
| **Conditional page flow:** | Display only if equipmentType === "New equipment" |

#### Data points

```javascript
{
    application: {
        purchaseDate: {
            type: "date",
            required: true
        },
        invoiceNumber: {
            type: "text",
            required: true
        },
        purchasePrice: {
            type: "number",
            required: true
        }
    }
}
```

#### Content

```markdown
# New equipment purchase details

## When did you purchase the equipment?

Day / Month / Year

## Invoice number

Enter the invoice number from your purchase

## Purchase price (£)

Enter the total purchase price in pounds
```

#### Errors

| **Field**      | **Value**                                  |
| -------------- | ------------------------------------------ |
| Description:   | Missing purchase date                      |
| Error message: | Enter the date you purchased the equipment |
| Description:   | Missing invoice number                     |
| Error message: | Enter your invoice number                  |
| Description:   | Missing purchase price                     |
| Error message: | Enter the purchase price                   |
| Description:   | Invalid price format                       |
| Error message: | Purchase price must be a number            |

---

### Page 2.2: Used Equipment Details (Conditional)

| **Field**                  | **Value**                                          |
| -------------------------- | -------------------------------------------------- |
| **Order number:**          | 2.2                                                |
| **Path:**                  | /used-equipment-details                            |
| **Title:**                 | Used equipment details                             |
| **Conditional page flow:** | Display only if equipmentType === "Used equipment" |

#### Data points

```javascript
{
    application: {
        yearOfManufacture: {
            type: "number",
            required: true
        },
        previousOwner: {
            type: "text",
            required: true
        },
        estimatedValue: {
            type: "number",
            required: true
        }
    }
}
```

#### Content

```markdown
# Used equipment details

## Year of manufacture

Enter the year the equipment was manufactured (for example, 2018)

## Previous owner

Enter the name of the previous owner

## Estimated current value (£)

Enter the estimated current value in pounds
```

#### Errors

| **Field**      | **Value**                            |
| -------------- | ------------------------------------ |
| Description:   | Missing year of manufacture          |
| Error message: | Enter the year of manufacture        |
| Description:   | Invalid year format                  |
| Error message: | Year must be a 4-digit number        |
| Description:   | Missing previous owner               |
| Error message: | Enter the name of the previous owner |
| Description:   | Missing estimated value              |
| Error message: | Enter the estimated value            |

---

### Page 3: Equipment Specifications

| **Field**                  | **Value**                                    |
| -------------------------- | -------------------------------------------- |
| **Order number:**          | 3                                            |
| **Path:**                  | /equipment-specifications                    |
| **Title:**                 | Equipment specifications                     |
| **Conditional page flow:** | None (shown for both new and used equipment) |

#### Data points

```javascript
{
    application: {
        equipmentName: {
            type: "text",
            required: true
        },
        manufacturer: {
            type: "text",
            required: true
        },
        modelNumber: {
            type: "text",
            required: true
        },
        serialNumber: {
            type: "text",
            required: true
        }
    }
}
```

#### Content

```markdown
# Equipment specifications

## Equipment name

Enter a name for this equipment (for example, 'North field tractor')

## Manufacturer

Enter the manufacturer name

## Model number

Enter the model number

## Serial number

Enter the serial number
```

#### Errors

| **Field**      | **Value**                   |
| -------------- | --------------------------- |
| Description:   | Missing equipment name      |
| Error message: | Enter an equipment name     |
| Description:   | Missing manufacturer        |
| Error message: | Enter the manufacturer name |
| Description:   | Missing model number        |
| Error message: | Enter the model number      |
| Description:   | Missing serial number       |
| Error message: | Enter the serial number     |

---

### Page 4: Additional Information

| **Field**                  | **Value**               |
| -------------------------- | ----------------------- |
| **Order number:**          | 4                       |
| **Path:**                  | /additional-information |
| **Title:**                 | Additional information  |
| **Conditional page flow:** | None                    |

#### Data points

```javascript
{
    application: {
        additionalNotes: {
            type: "textarea",
            required: false
        }
    }
}
```

#### Content

```markdown
# Additional information

## Additional notes (optional)

Provide any additional information about the equipment that may be relevant for subsidy purposes
```

#### Errors

None (optional field)

---

### Page 5: Check Your Answers

| **Field**                  | **Value**                            |
| -------------------------- | ------------------------------------ |
| **Order number:**          | 5                                    |
| **Path:**                  | /check-your-answers                  |
| **Title:**                 | Check your answers before submitting |
| **Conditional page flow:** | None                                 |
| **Controller:**            | SummaryPageController                |

#### Content

Summary page displaying all collected information based on the journey taken.

**For New Equipment:**

- Equipment type: New equipment
- Purchase date: [date]
- Invoice number: [number]
- Purchase price: £[amount]
- Equipment name: [name]
- Manufacturer: [manufacturer]
- Model number: [model]
- Serial number: [serial]
- Additional notes: [notes if provided]

**For Used Equipment:**

- Equipment type: Used equipment
- Year of manufacture: [year]
- Previous owner: [name]
- Estimated value: £[amount]
- Equipment name: [name]
- Manufacturer: [manufacturer]
- Model number: [model]
- Serial number: [serial]
- Additional notes: [notes if provided]

---

## Confirmation Page

After submission, display:

```markdown
# Equipment registered

Your reference number is: EQP-[timestamp]

## What happens next

We have received your equipment registration.

Your equipment has been added to our records for subsidy processing.

You can quote reference number EQP-[timestamp] in any correspondence.

## Need help?

If you have questions about your registration:

Email: equipment-subsidies@defra.gov.uk
Telephone: 0300 123 4568
Monday to Friday, 9am to 5pm
```

---

## Technical Requirements

### Implementation Notes

This journey demonstrates:

1. **Conditional routing** with two branches
2. **Different field types**: text, number, date, textarea, radios
3. **Validation** for all required fields
4. **Sections** for the summary page
5. **Branch convergence** - both paths lead to common pages

### Key Features Required

1. **Conditional Logic**:

   - Branch at page 1 based on equipment type
   - Show either "New equipment" OR "Used equipment" page
   - Both branches converge at "Equipment specifications"

2. **Component Types Needed**:

   - RadiosField (equipment type selection)
   - TextField (text inputs)
   - NumberField (prices, year)
   - DatePartsField (purchase date for new equipment)
   - MultilineTextField (additional notes)
   - SummaryPageController (check answers)

3. **Validation Requirements**:

   - All required fields must have error messages
   - Number fields should validate numeric input
   - Date field should validate proper date format
   - All fields should show appropriate error messages

4. **Data Structure**:

```javascript
application: {
  equipmentType: 'New equipment' | 'Used equipment',

  // Conditional - only for new equipment:
  purchaseDate: Date,
  invoiceNumber: string,
  purchasePrice: number,

  // Conditional - only for used equipment:
  yearOfManufacture: number,
  previousOwner: string,
  estimatedValue: number,

  // Common to both paths:
  equipmentName: string,
  manufacturer: string,
  modelNumber: string,
  serialNumber: string,
  additionalNotes: string (optional)
}
```

### Sections for Summary

Define a section called `equipmentDetails` that includes:

- The conditional pages (new equipment OR used equipment details)
- Equipment specifications page
- Additional information page

---

## Expected User Flows

**Flow 1: New Equipment**

1. Equipment type → Select "New equipment"
2. New equipment purchase details → Enter date, invoice, price
3. Equipment specifications → Enter name, manufacturer, model, serial
4. Additional information → Optional notes
5. Check answers → Review
6. Confirmation → Success with reference EQP-[timestamp]

**Flow 2: Used Equipment**

1. Equipment type → Select "Used equipment"
2. Used equipment details → Enter year, previous owner, value
3. Equipment specifications → Enter name, manufacturer, model, serial
4. Additional information → Optional notes
5. Check answers → Review
6. Confirmation → Success with reference EQP-[timestamp]

---

## Implementation Checklist

- [ ] Generate UUIDs for all pages, components, lists, conditions
- [ ] Create IDS object with all static UUIDs
- [ ] Create equipment-registration-service.js
- [ ] Define metadata with slug 'equipment-registration'
- [ ] Create all 7 pages (1 branch, 2 conditional, 3 common, 1 summary)
- [ ] Define conditions for new vs used equipment branching
- [ ] Create lists array with equipment type options
- [ ] Define sections for summary page grouping
- [ ] Implement formsService with getFormMetadata and getFormDefinition
- [ ] Implement outputService with submit function
- [ ] Implement formSubmissionService with submit and persistFiles
- [ ] Export as array: `[{ formsService, outputService, formSubmissionService }]`
- [ ] Register in server.js allServices array
- [ ] Add link to home page table
- [ ] Test both branches end-to-end
- [ ] Verify all validation messages
- [ ] Check summary page shows correct conditional data

---

## Success Criteria

✅ Server starts without errors
✅ Form appears on home page
✅ Can select "New equipment" and complete that flow
✅ Can select "Used equipment" and complete that flow
✅ Conditional pages only show for their respective paths
✅ All validation works correctly
✅ Summary page shows correct data based on branch taken
✅ Form submits successfully with reference number
✅ Confirmation page displays

---

## Notes for Implementation

- This journey is similar complexity to the location form example
- Tests the same conditional routing pattern but with different field types
- Good test case for the `/new-journey` slash command
- Reference prefix should be "EQP-" instead of "LOC-"
- Use sections to group related pages for the summary
