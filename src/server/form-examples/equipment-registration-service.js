import Boom from '@hapi/boom'

// Static UUIDs for cross-referencing (not generated at runtime)
const IDS = {
  // Pages
  equipmentTypePage: '5ce116c4-fbda-4227-add3-57531b29ced2',
  newEquipmentPage: 'df55399e-8cf3-48d1-be31-e3fec00a0ede',
  usedEquipmentPage: '911adadd-b16f-4c5e-9735-f0bf9cf4ce7e',
  equipmentSpecsPage: '33c29d00-edbb-4f28-8b48-92d0a3c22743',
  additionalInfoPage: '6388de69-a3a1-4c2e-ae0c-e5ec38a3009d',
  summaryPage: 'f1e2d3c4-b5a6-9788-6543-21fedcba9876',

  // Components
  equipmentTypeComponent: 'd6c8c6a5-7ecb-4272-bd32-0b9db772c756',
  purchaseDateComponent: '4c977e41-776f-4c14-a821-c29761590214',
  invoiceNumberComponent: '7db93511-631b-44b7-aed8-636d0a704792',
  purchasePriceComponent: '14880229-011a-471b-a2ec-935a380ff5bf',
  yearOfManufactureComponent: '5277c458-1b1d-4b11-a6c7-f7f7644b0693',
  previousOwnerComponent: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
  estimatedValueComponent: 'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
  equipmentNameComponent: 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
  manufacturerComponent: 'd4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
  modelNumberComponent: 'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
  serialNumberComponent: 'f6a7b8c9-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
  additionalNotesComponent: 'a7b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d',

  // Lists
  equipmentTypesList: '9d7bbe1a-6424-44fd-b0e0-0fea490a2dd0',

  // List Items (MUST have IDs for ListItemRef)
  newEquipmentItem: 'd28789ad-aeee-40f6-a39c-a2ef186465c1',
  usedEquipmentItem: '83dd14f8-f957-43ca-92bb-be9fd67f3197',

  // Conditions
  newEquipmentCondition: '8d721c4c-2c43-4f57-a534-aa16ddeabb72',
  usedEquipmentCondition: '481ed002-f6a8-4895-bb93-af046f1c86c3',

  // Condition Items
  newEquipmentConditionItem: '4e9c96c8-fbd6-43f3-8cc5-8cccb991bfc0',
  usedEquipmentConditionItem: '5b195d0a-e7ea-47e3-8fc5-d077f2fb4332'
}

// Form metadata
const now = new Date()
const user = { id: 'example-user', displayName: 'Example user' }

const author = {
  createdAt: now,
  createdBy: user,
  updatedAt: now,
  updatedBy: user
}

const metadata = {
  id: 'equipment-registration-form-id',
  slug: 'equipment-registration',
  title: 'Agricultural Equipment Registration',
  organisation: 'Defra',
  teamName: 'Example team',
  teamEmail: 'example-team@defra.gov.uk',
  submissionGuidance: 'Thanks for submitting your response',
  notificationEmail: 'example-email@defra.com',
  ...author,
  live: author
}

const definition = {
  name: 'Agricultural Equipment Registration',
  engine: 'V2',
  schema: 2,
  startPage: '/what-type-of-equipment-are-you-registering',
  pages: [
    // Page 1: Equipment Type Selection (branching point)
    {
      title: 'What type of equipment are you registering?',
      path: '/what-type-of-equipment-are-you-registering',
      components: [
        {
          type: 'RadiosField',
          title: 'What type of equipment are you registering?',
          name: 'equipmentType',
          hint: 'Select whether you are registering new or used equipment.',
          options: {
            required: true
          },
          schema: {
            error: {
              required:
                'Select whether you are registering new or used equipment'
            }
          },
          list: IDS.equipmentTypesList,
          id: IDS.equipmentTypeComponent
        }
      ],
      next: [
        {
          path: '/new-equipment-purchase-details',
          condition: IDS.newEquipmentCondition
        },
        {
          path: '/used-equipment-details',
          condition: IDS.usedEquipmentCondition
        }
      ],
      id: IDS.equipmentTypePage
    },

    // Page 2.1: New Equipment Details (conditional)
    {
      title: 'New equipment purchase details',
      path: '/new-equipment-purchase-details',
      section: 'equipmentDetails',
      condition: IDS.newEquipmentCondition,
      components: [
        {
          type: 'DatePartsField',
          title: 'When did you purchase the equipment?',
          name: 'purchaseDate',
          options: {
            required: true
          },
          schema: {
            error: {
              required: 'Enter the date you purchased the equipment'
            }
          },
          id: IDS.purchaseDateComponent
        },
        {
          type: 'TextField',
          title: 'Invoice number',
          name: 'invoiceNumber',
          hint: 'Enter the invoice number from your purchase',
          options: {
            required: true
          },
          schema: {
            error: {
              required: 'Enter your invoice number'
            }
          },
          id: IDS.invoiceNumberComponent
        },
        {
          type: 'NumberField',
          title: 'Purchase price (£)',
          name: 'purchasePrice',
          hint: 'Enter the total purchase price in pounds',
          options: {
            required: true
          },
          schema: {
            error: {
              required: 'Enter the purchase price'
            }
          },
          id: IDS.purchasePriceComponent
        }
      ],
      next: [{ path: '/equipment-specifications' }],
      id: IDS.newEquipmentPage
    },

    // Page 2.2: Used Equipment Details (conditional)
    {
      title: 'Used equipment details',
      path: '/used-equipment-details',
      section: 'equipmentDetails',
      condition: IDS.usedEquipmentCondition,
      components: [
        {
          type: 'NumberField',
          title: 'Year of manufacture',
          name: 'yearOfManufacture',
          hint: 'Enter the year the equipment was manufactured (for example, 2018)',
          options: {
            required: true
          },
          schema: {
            error: {
              required: 'Enter the year of manufacture'
            }
          },
          id: IDS.yearOfManufactureComponent
        },
        {
          type: 'TextField',
          title: 'Previous owner',
          name: 'previousOwner',
          hint: 'Enter the name of the previous owner',
          options: {
            required: true
          },
          schema: {
            error: {
              required: 'Enter the name of the previous owner'
            }
          },
          id: IDS.previousOwnerComponent
        },
        {
          type: 'NumberField',
          title: 'Estimated current value (£)',
          name: 'estimatedValue',
          hint: 'Enter the estimated current value in pounds',
          options: {
            required: true
          },
          schema: {
            error: {
              required: 'Enter the estimated value'
            }
          },
          id: IDS.estimatedValueComponent
        }
      ],
      next: [{ path: '/equipment-specifications' }],
      id: IDS.usedEquipmentPage
    },

    // Page 3: Equipment Specifications (common to both paths)
    {
      title: 'Equipment specifications',
      path: '/equipment-specifications',
      section: 'equipmentDetails',
      components: [
        {
          type: 'TextField',
          title: 'Equipment name',
          name: 'equipmentName',
          hint: "Enter a name for this equipment (for example, 'North field tractor')",
          options: {
            required: true
          },
          schema: {
            error: {
              required: 'Enter an equipment name'
            }
          },
          id: IDS.equipmentNameComponent
        },
        {
          type: 'TextField',
          title: 'Manufacturer',
          name: 'manufacturer',
          hint: 'Enter the manufacturer name',
          options: {
            required: true
          },
          schema: {
            error: {
              required: 'Enter the manufacturer name'
            }
          },
          id: IDS.manufacturerComponent
        },
        {
          type: 'TextField',
          title: 'Model number',
          name: 'modelNumber',
          hint: 'Enter the model number',
          options: {
            required: true
          },
          schema: {
            error: {
              required: 'Enter the model number'
            }
          },
          id: IDS.modelNumberComponent
        },
        {
          type: 'TextField',
          title: 'Serial number',
          name: 'serialNumber',
          hint: 'Enter the serial number',
          options: {
            required: true
          },
          schema: {
            error: {
              required: 'Enter the serial number'
            }
          },
          id: IDS.serialNumberComponent
        }
      ],
      next: [{ path: '/additional-information' }],
      id: IDS.equipmentSpecsPage
    },

    // Page 4: Additional Information (common to both paths)
    {
      title: 'Additional information',
      path: '/additional-information',
      section: 'equipmentDetails',
      components: [
        {
          type: 'MultilineTextField',
          title: 'Additional notes (optional)',
          name: 'additionalNotes',
          hint: 'Provide any additional information about the equipment that may be relevant for subsidy purposes',
          options: {
            required: false
          },
          schema: {},
          id: IDS.additionalNotesComponent
        }
      ],
      next: [{ path: '/check-your-answers' }],
      id: IDS.additionalInfoPage
    },

    // Page 5: Check Your Answers (Summary)
    {
      title: 'Check your answers',
      path: '/check-your-answers',
      controller: 'SummaryPageController',
      components: [],
      next: [],
      id: IDS.summaryPage
    }
  ],

  // Conditions for conditional routing
  conditions: [
    {
      items: [
        {
          id: IDS.newEquipmentConditionItem,
          componentId: IDS.equipmentTypeComponent,
          operator: 'is',
          value: {
            itemId: IDS.newEquipmentItem,
            listId: IDS.equipmentTypesList
          },
          type: 'ListItemRef'
        }
      ],
      displayName: 'New equipment selected',
      id: IDS.newEquipmentCondition
    },
    {
      items: [
        {
          id: IDS.usedEquipmentConditionItem,
          componentId: IDS.equipmentTypeComponent,
          operator: 'is',
          value: {
            itemId: IDS.usedEquipmentItem,
            listId: IDS.equipmentTypesList
          },
          type: 'ListItemRef'
        }
      ],
      displayName: 'Used equipment selected',
      id: IDS.usedEquipmentCondition
    }
  ],

  // Sections for grouping pages
  sections: [
    {
      name: 'equipmentDetails',
      title: 'Equipment details'
    }
  ],

  // Lists for radio options
  lists: [
    {
      name: 'equipmentTypes',
      title: 'Equipment Types',
      type: 'string',
      id: IDS.equipmentTypesList,
      items: [
        {
          id: IDS.newEquipmentItem,
          text: 'New equipment',
          value: 'New equipment'
        },
        {
          id: IDS.usedEquipmentItem,
          text: 'Used equipment',
          value: 'Used equipment'
        }
      ]
    }
  ]
}

const formsService = {
  getFormMetadata: function (slug) {
    if (slug === metadata.slug) {
      return Promise.resolve(metadata)
    }
    throw Boom.notFound(`Form '${slug}' not found`)
  },
  getFormDefinition: function (id) {
    if (id === metadata.id) {
      return Promise.resolve(definition)
    }
    throw Boom.notFound(`Form '${id}' not found`)
  }
}

const outputService = {
  submit: async function (
    context,
    request,
    model,
    emailAddress,
    items,
    submitResponse
  ) {
    const referenceNumber = `EQP-${Date.now()}`

    console.log('✅ Equipment registration form submitted successfully!')
    console.log('Reference:', referenceNumber)
    console.log(
      'Data:',
      items.map((i) => ({ name: i.name, value: i.value }))
    )

    return {
      title: 'Equipment registered',
      content: `Your reference number is: ${referenceNumber}

## What happens next

We have received your equipment registration.

Your equipment has been added to our records for subsidy processing.

You can quote reference number ${referenceNumber} in any correspondence.

## Need help?

If you have questions about your registration:

Email: equipment-subsidies@defra.gov.uk
Telephone: 0300 123 4568
Monday to Friday, 9am to 5pm`
    }
  }
}

const formSubmissionService = {
  submit: async function (payload, request) {
    const reference = `EQP-${Date.now()}`

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

// Export as array for spreading in server.js
export default [{ formsService, outputService, formSubmissionService }]
