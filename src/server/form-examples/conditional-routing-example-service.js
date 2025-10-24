import Boom from '@hapi/boom'

// Fixed UUIDs for cross-referencing (not generated at runtime)
const IDS = {
  // Component IDs
  locationMethodComponent: 'd6c8c6a5-7ecb-4272-bd32-0b9db772c756',

  // List IDs
  locationMethodsList: '9d7bbe1a-6424-44fd-b0e0-0fea490a2dd0',

  // List Item IDs
  postcodeItem: 'd28789ad-aeee-40f6-a39c-a2ef186465c1',
  mapItem: '83dd14f8-f957-43ca-92bb-be9fd67f3197',

  // Condition IDs
  postcodeCondition: '8d721c4c-2c43-4f57-a534-aa16ddeabb72',
  mapCondition: '481ed002-f6a8-4895-bb93-af046f1c86c3',

  // Condition Item IDs
  postcodeConditionItem: '4e9c96c8-fbd6-43f3-8cc5-8cccb991bfc0',
  mapConditionItem: '5b195d0a-e7ea-47e3-8fc5-d077f2fb4332',

  // Page IDs
  locationMethodPage: '5ce116c4-fbda-4227-add3-57531b29ced2',
  postcodeEntryPage: 'df55399e-8cf3-48d1-be31-e3fec00a0ede',
  mapDrawingPage: '911adadd-b16f-4c5e-9735-f0bf9cf4ce7e',
  siteDetailsPage: '33c29d00-edbb-4f28-8b48-92d0a3c22743',
  summaryPage: '6388de69-a3a1-4c2e-ae0c-e5ec38a3009d',

  // Component IDs for other fields
  postcodeComponent: '4c977e41-776f-4c14-a821-c29761590214',
  mapComponent: '7db93511-631b-44b7-aed8-636d0a704792',
  siteNameComponent: '14880229-011a-471b-a2ec-935a380ff5bf',
  siteDescComponent: '5277c458-1b1d-4b11-a6c7-f7f7644b0693'
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
  id: 'location-form-id',
  slug: 'location-form',
  title: 'Development Site Location Form',
  organisation: 'Defra',
  teamName: 'Example team',
  teamEmail: 'example-team@defra.gov.uk',
  submissionGuidance: 'Thanks for submitting your response',
  notificationEmail: 'example-email@defra.com',
  ...author,
  live: author
}

const definition = {
  name: 'Development Site Location Form',
  engine: 'V2',
  schema: 2,
  startPage: '/how-would-you-like-to-provide-your-development-site-location',
  pages: [
    // Page 1: Location Method Selection (branching point)
    {
      title: 'How would you like to provide your development site location?',
      path: '/how-would-you-like-to-provide-your-development-site-location',
      components: [
        {
          type: 'RadiosField',
          title:
            'How would you like to provide your development site location?',
          name: 'locationMethod',
          options: {
            required: true
          },
          schema: {
            error: {
              required:
                'Select how you would like to provide the development location'
            }
          },
          list: IDS.locationMethodsList,
          id: IDS.locationMethodComponent
        }
      ],
      next: [
        {
          path: '/enter-your-development-site-postcode',
          condition: IDS.postcodeCondition
        },
        {
          path: '/draw-development-site-boundary',
          condition: IDS.mapCondition
        }
      ],
      id: IDS.locationMethodPage
    },

    // Page 2.1: Enter Postcode (conditional)
    {
      title: 'Enter your development site postcode',
      path: '/enter-your-development-site-postcode',
      section: 'locationDetails',
      condition: IDS.postcodeCondition,
      components: [
        {
          type: 'TextField',
          title: 'Enter your development site postcode',
          name: 'sitePostcode',
          options: {
            required: true,
            classes: 'govuk-input--width-10'
          },
          schema: {
            error: {
              required: 'Enter a postcode',
              regex: 'Enter a postcode in the correct format, like SW1A 1AA'
            }
          },
          id: IDS.postcodeComponent
        }
      ],
      next: [{ path: '/confirm-site-details' }],
      id: IDS.postcodeEntryPage
    },

    // Page 2.2: Draw on Map (conditional)
    {
      title: 'Draw your development site boundary',
      path: '/draw-development-site-boundary',
      section: 'locationDetails',
      condition: IDS.mapCondition,
      components: [
        {
          type: 'TextField',
          title: 'Draw your development site boundary',
          name: 'siteMapCoordinates',
          hint: 'Use the map below to draw the boundary of your development site. Click on the map to place points and create a boundary around your site.',
          options: {
            required: true
          },
          schema: {
            error: {
              required: 'Draw a boundary on the map to continue'
            }
          },
          id: IDS.mapComponent
        }
      ],
      next: [{ path: '/confirm-site-details' }],
      id: IDS.mapDrawingPage
    },

    // Page 3: Confirm Site Details
    {
      title: 'Confirm your site details',
      path: '/confirm-site-details',
      section: 'locationDetails',
      components: [
        {
          type: 'TextField',
          title: 'Site name',
          name: 'siteName',
          hint: 'Enter a name for this development site',
          options: {
            required: true
          },
          schema: {
            error: {
              required: 'Enter a name for the development site'
            }
          },
          id: IDS.siteNameComponent
        },
        {
          type: 'MultilineTextField',
          title: 'Site description (optional)',
          name: 'siteDescription',
          hint: 'Provide any additional details about the site',
          options: {
            required: false
          },
          schema: {},
          id: IDS.siteDescComponent
        }
      ],
      next: [{ path: '/check-your-answers' }],
      id: IDS.siteDetailsPage
    },

    // Page 4: Check Your Answers (Summary)
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
          id: IDS.postcodeConditionItem,
          componentId: IDS.locationMethodComponent,
          operator: 'is',
          value: {
            itemId: IDS.postcodeItem,
            listId: IDS.locationMethodsList
          },
          type: 'ListItemRef'
        }
      ],
      displayName: 'Postcode is selected',
      id: IDS.postcodeCondition
    },
    {
      items: [
        {
          id: IDS.mapConditionItem,
          componentId: IDS.locationMethodComponent,
          operator: 'is',
          value: {
            itemId: IDS.mapItem,
            listId: IDS.locationMethodsList
          },
          type: 'ListItemRef'
        }
      ],
      displayName: 'Draw on map is selected',
      id: IDS.mapCondition
    }
  ],

  // Sections for grouping pages
  sections: [
    {
      name: 'locationDetails',
      title: 'Location details'
    }
  ],

  // Lists for radio options
  lists: [
    {
      name: 'locationMethods',
      title: 'Location Methods',
      type: 'string',
      id: IDS.locationMethodsList,
      items: [
        {
          id: IDS.postcodeItem,
          text: 'Enter a postcode',
          value: 'Enter a postcode'
        },
        {
          id: IDS.mapItem,
          text: 'Draw on a map',
          value: 'Draw on a map'
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
    const referenceNumber = `LOC-${Date.now()}`

    console.log('✅ Location form submitted successfully!')
    console.log('Reference:', referenceNumber)
    console.log(
      'Data:',
      items.map((i) => ({ name: i.name, value: i.value }))
    )

    return {
      title: 'Site location submitted',
      content: `Your reference number is: ${referenceNumber}

## What happens next

We have saved the location details for your development site.

You can use the reference number ${referenceNumber} to retrieve these details later.

## Contact us

If you need help, contact the planning team:

Email: planning@example.gov.uk
Telephone: 0300 123 4567
Monday to Friday, 9am to 5pm`
    }
  }
}

const formSubmissionService = {
  submit: async function (payload, request) {
    const reference = `LOC-${Date.now()}`

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
