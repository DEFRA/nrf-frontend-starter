import Boom from '@hapi/boom'

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
  id: '12345678-90ab-cdef-1234-567890abcdef',
  slug: 'location-form',
  title: 'Development Site Location Form',
  organisation: 'Defra',
  teamName: 'Example team',
  teamEmail: 'example-team@defra.gov.uk',
  submissionGuidance: 'Thanks for providing your development site location',
  notificationEmail: 'example-email-submission-recipient@defra.com',
  ...author,
  live: author
}

const definition = {
  name: 'Dan - test',
  engine: 'V2',
  schema: 2,
  startPage: '/summary',
  pages: [
    {
      title: '',
      path: '/how-would-you-like-to-provide-your-development-site-location',
      components: [
        {
          type: 'RadiosField',
          title:
            'How would you like to provide your development site location?',
          name: 'SYQpGU',
          shortDescription: 'Select your preferred method',
          hint: 'Choose the method that works best for you. You can upload a file with your development boundary, enter a postcode, provide coordinates, or draw on a map.',
          options: {
            required: true
          },
          schema: {},
          list: '9d7bbe1a-6424-44fd-b0e0-0fea490a2dd0',
          id: 'd6c8c6a5-7ecb-4272-bd32-0b9db772c756'
        }
      ],
      next: [],
      id: 'e4f50276-7e2c-42d4-988f-3c3ad3d4ac83'
    },
    {
      controller: 'FileUploadPageController',
      title: '',
      path: '/upload-your-development-boundary-file',
      components: [
        {
          type: 'FileUploadField',
          title: 'Upload your development boundary file',
          name: 'dVAPFw',
          shortDescription: 'File upload',
          hint: 'Upload a file containing your development site boundary. We support shape files, KML files, and GeoJSON files.',
          options: {
            required: true,
            accept:
              'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,text/plain,image/jpeg,text/csv,application/vnd.oasis.opendocument.spreadsheet'
          },
          schema: {
            min: 1,
            max: 5
          },
          id: 'ed408497-a753-4642-89e6-3c671a82abe7'
        }
      ],
      next: [],
      id: '84254391-93ae-445c-96b1-ef5018948577',
      condition: '4d237c09-217e-4ad2-aae9-fa8243276d56'
    },
    {
      title: '',
      path: '/enter-your-development-site-postcode',
      components: [
        {
          type: 'TextField',
          title: 'Enter your development site postcode',
          name: 'StTHJK',
          shortDescription: 'Postcode',
          hint: "Enter the postcode of your development site. We'll use this to locate your site on a map where you can draw the boundary.",
          options: {
            required: true,
            classes: 'govuk-input--width-10',
            autocomplete: 'postal-code'
          },
          schema: {
            regex:
              '^([A-Za-z]{1,2}[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$',
            messages: {
              regex: 'Enter a valid UK postcode'
            }
          },
          id: '218110d5-3b2c-4023-86c3-0f1f071da37b'
        }
      ],
      next: [],
      id: '41fcecf7-b004-442c-bd4c-941013ef88fc',
      condition: 'cad5f36c-71db-4ece-83ec-26b8921dcea4'
    },
    {
      title: '',
      path: '/enter-your-development-site-coordinates',
      components: [
        {
          type: 'TextField',
          title: 'Enter your development site coordinates',
          name: 'nVXqZE',
          shortDescription: 'Coordinates',
          hint: "Enter the latitude and longitude coordinates of your development site. We'll use this to locate your site on a map where you can draw the boundary.",
          options: {
            required: true
          },
          schema: {},
          id: '9bf931d7-c1b0-4437-89af-311bc9648541'
        }
      ],
      next: [],
      id: '48d045de-8306-4a34-b77b-6d441b1fcfd0',
      condition: '00c2571c-6ae1-4445-91b6-ade76b95126c'
    },
    {
      title: 'Draw your development boundary',
      path: '/draw-your-development-boundary',
      controller: 'MapDrawingController',
      components: [
        {
          type: 'TextField',
          title: 'Draw your development boundary',
          name: 'NiAeAB',
          shortDescription: 'Map drawing',
          hint: 'Use the map below to draw the boundary of your development site. Click on the map to add points and create a polygon.',
          options: {
            required: true
          },
          schema: {},
          id: '0d1c3d79-6f26-4fdf-ab0c-e57ec9740b63'
        }
      ],
      next: [],
      id: '138dfccf-aff9-4e5b-8ca4-54edc5862a6d',
      condition: 'a971b6c9-a565-4500-b8eb-903e9dfbaff5'
    },
    {
      id: '449a45f6-4541-4a46-91bd-8b8931b07b50',
      title: 'Summary',
      path: '/summary',
      controller: 'SummaryPageController',
      next: []
    }
  ],
  conditions: [
    {
      items: [
        {
          id: '2d620476-a833-42f0-86dc-7dba94aa2cd4',
          componentId: 'd6c8c6a5-7ecb-4272-bd32-0b9db772c756',
          operator: 'is',
          value: {
            itemId: 'd28789ad-aeee-40f6-a39c-a2ef186465c1',
            listId: '9d7bbe1a-6424-44fd-b0e0-0fea490a2dd0'
          },
          type: 'ListItemRef'
        }
      ],
      displayName: 'Upload boundary file selected',
      id: '4d237c09-217e-4ad2-aae9-fa8243276d56'
    },
    {
      items: [
        {
          id: '26bd2db5-afe1-4f68-b60b-ea9f51155576',
          componentId: 'd6c8c6a5-7ecb-4272-bd32-0b9db772c756',
          operator: 'is',
          value: {
            itemId: 'c4d3789b-5533-48ae-b1e7-2b0afa108b3b',
            listId: '9d7bbe1a-6424-44fd-b0e0-0fea490a2dd0'
          },
          type: 'ListItemRef'
        }
      ],
      displayName: 'Postcode is selected',
      id: 'cad5f36c-71db-4ece-83ec-26b8921dcea4'
    },
    {
      items: [
        {
          id: '659ef032-6ed3-45d7-b17f-75bd33a76950',
          componentId: 'd6c8c6a5-7ecb-4272-bd32-0b9db772c756',
          operator: 'is',
          value: {
            itemId: 'a094e62a-2d84-431c-83f7-a34d9c1e7e77',
            listId: '9d7bbe1a-6424-44fd-b0e0-0fea490a2dd0'
          },
          type: 'ListItemRef'
        }
      ],
      displayName: 'Coordinates is selected',
      id: '00c2571c-6ae1-4445-91b6-ade76b95126c'
    },
    {
      items: [
        {
          id: 'c1300dd4-d996-472d-946a-21605e5d900a',
          componentId: 'd6c8c6a5-7ecb-4272-bd32-0b9db772c756',
          operator: 'is',
          value: {
            itemId: '41512ed9-7e41-42ed-94bc-3e429a0753c3',
            listId: '9d7bbe1a-6424-44fd-b0e0-0fea490a2dd0'
          },
          type: 'ListItemRef'
        }
      ],
      displayName: 'Draw on map is selected',
      id: 'a971b6c9-a565-4500-b8eb-903e9dfbaff5'
    }
  ],
  sections: [],
  lists: [
    {
      name: 'ErNfeI',
      title: 'List for question SYQpGU',
      type: 'string',
      items: [
        {
          id: 'd28789ad-aeee-40f6-a39c-a2ef186465c1',
          text: 'Upload a boundary file',
          hint: {
            text: 'Upload a shape file (.shp), KML file (.kml), or GeoJSON file (.geojson) containing your development boundary.',
            id: '0e615f85-fc76-407d-ab04-55606019be0b'
          },
          value: 'Upload a boundary file'
        },
        {
          id: 'c4d3789b-5533-48ae-b1e7-2b0afa108b3b',
          text: 'Enter a postcode',
          hint: {
            text: 'Enter the postcode of your development site and draw the boundary on a map.',
            id: '1e51896f-fc0d-43ce-8c43-70948c1a26f4'
          },
          value: 'Enter a postcode'
        },
        {
          id: 'a094e62a-2d84-431c-83f7-a34d9c1e7e77',
          text: 'Enter coordinates',
          hint: {
            text: 'Enter the latitude and longitude coordinates of your development site and draw the boundary.',
            id: '63e429c5-b64b-4bfb-9bb2-8470caae0e97'
          },
          value: 'Enter coordinates'
        },
        {
          id: '41512ed9-7e41-42ed-94bc-3e429a0753c3',
          text: 'Draw on a map',
          hint: {
            text: 'Use an interactive map to locate and draw your development boundary.',
            id: 'f73ca0bf-672f-4a6b-9fd2-6c770ac233d4'
          },
          value: 'Draw on a map'
        }
      ],
      id: '9d7bbe1a-6424-44fd-b0e0-0fea490a2dd0'
    }
  ]
}

const formsService = {
  getFormMetadata: function (slug) {
    switch (slug) {
      case metadata.slug:
        return Promise.resolve(metadata)
      default:
        throw Boom.notFound(`Form '${slug}' not found`)
    }
  },
  getFormDefinition: function (id) {
    switch (id) {
      case metadata.id:
        return Promise.resolve(definition)
      default:
        throw Boom.notFound(`Form '${id}' not found`)
    }
  }
}

// Output service for handling form submissions
const outputService = {
  // Submit form data - store ONLY simple, serializable data
  // The plugin calls this with: (context, request, model, emailAddress, items, submitResponse)
  submit: async function (
    context,
    request,
    model,
    emailAddress,
    items,
    submitResponse
  ) {
    console.log('OUTPUT SERVICE SUBMIT CALLED')

    // Generate a reference number
    const referenceNumber = `REF-${Date.now()}`

    // Extract form data - prefer submitResponse if available (V2 forms engine)
    const formData = {}

    // Check if we have submitResponse with processed data (from formSubmissionService)
    if (submitResponse && submitResponse.main) {
      console.log('Using submitResponse data (V2 format)')
      if (Array.isArray(submitResponse.main)) {
        submitResponse.main.forEach((item) => {
          formData[item.name] = {
            label: item.title || item.name,
            value: item.value
          }
        })
      }
    }
    // Fallback to items if no submitResponse (shouldn't happen in V2)
    else if (Array.isArray(items)) {
      console.log('Falling back to items array')
      items.forEach((item) => {
        try {
          // Only extract simple, serializable properties
          if (
            item &&
            typeof item === 'object' &&
            item.name &&
            item.value !== undefined
          ) {
            formData[item.name] = {
              label: String(item.label || item.name || ''),
              value: String(item.value || '')
            }
          }
        } catch (e) {
          console.log('Error extracting item:', e.message)
        }
      })
    }

    // Log the extracted data (safe to stringify)
    console.log('Form data extracted:', JSON.stringify(formData, null, 2))

    // Extract location method and details for easier display
    let locationMethod = '-'
    let locationDetails = '-'

    // Get location method (from the first question)
    if (formData['SYQpGU']) {
      locationMethod = formData['SYQpGU'].value
    }

    // Get location details based on the method selected
    if (formData['StTHJK']) {
      // Postcode
      locationDetails = formData['StTHJK'].value
    } else if (formData['nVXqZE']) {
      // Coordinates
      locationDetails = formData['nVXqZE'].value
    } else if (formData['NiAeAB']) {
      // Map drawing - this would contain the drawn polygon data
      locationDetails = formData['NiAeAB'].value || 'Map boundary drawn'
    } else if (formData['dVAPFw']) {
      // File upload
      locationDetails = 'File uploaded'
    }

    // Create a simple submission record that matches what the template expects
    const simpleSubmission = {
      id: referenceNumber,
      date: new Date().toISOString(), // Template expects 'date', not 'timestamp'
      status: 'Pending Payment', // More realistic status
      formName: 'Environmental Development Plan',
      levy: Math.floor(Math.random() * 10000) + 1000, // Random levy amount for demo
      // Store location method and details separately for cleaner display
      locationMethod,
      locationDetails,
      // Store all the form data for reference
      formData,
      data: {
        // Also keep the location for backward compatibility - extract safely
        location:
          formData['StTHJK']?.value ||
          formData['nVXqZE']?.value ||
          formData['NiAeAB']?.value ||
          'Unknown location'
      }
    }

    // Store in session (this is safe now - no circular refs)
    const session = request.yar
    const submissions = session.get('submissions') || []
    submissions.push(simpleSubmission)
    session.set('submissions', submissions)

    console.log('Submission stored:', simpleSubmission)

    // Return what the plugin expects for the confirmation page
    return {
      reference: referenceNumber,
      confirmation: {
        title: 'Application complete',
        message: `Your reference number is ${referenceNumber}`
      }
    }
  },

  // Get all submissions from session
  getSubmissions: async function (request) {
    const session = request.yar
    const submissions = session.get('submissions') || []
    return submissions
  }
}

// Form submission service for handling file uploads
const formSubmissionService = {
  // Submit form data - called by the plugin during form submission
  submit: async function (payload, request) {
    console.log('Form submission service called')

    // Generate a unique reference
    const reference = `REF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Return the structure that outputService.submit expects
    // This includes the main array with properly formatted data
    return {
      id: reference,
      reference,
      sessionId: payload.sessionId || 'unknown',
      retrievalKey: payload.retrievalKey || 'unknown',
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      main: payload.main || [], // This contains {name, title, value} objects
      repeaters: payload.repeaters || []
    }
  },

  // Persist files - placeholder implementation as we don't need actual file handling yet
  persistFiles: async function (context, request, model) {
    // File persistence not required for this example
    // Just return resolved promise to satisfy the plugin requirements
    return Promise.resolve()
  }
}

export default { formsService, outputService, formSubmissionService }
