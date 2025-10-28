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
  id: 'hello-world-form-id',
  slug: 'hello-world',
  title: 'Hello World Form',
  organisation: 'Defra',
  teamName: 'Example team',
  teamEmail: 'example-team@defra.gov.uk',
  submissionGuidance: 'Thanks for submitting your response',
  notificationEmail: 'example-email@defra.com',
  ...author,
  live: author
}

const definition = {
  name: 'Hello World',
  engine: 'V2',
  schema: 2,
  startPage: '/hello',
  pages: [
    {
      title: 'Hello World Form',
      path: '/hello',
      components: [
        {
          type: 'TextField',
          title: 'What is your name?',
          name: 'yourName',
          hint: 'Enter your full name',
          options: {
            required: true
          },
          schema: {},
          id: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d'
        }
      ],
      next: [{ path: '/summary' }],
      id: '0c8a1234-56ef-78ab-90cd-1234567890ab'
    },
    {
      title: 'Check your answers',
      path: '/summary',
      controller: 'SummaryPageController',
      components: [],
      next: [],
      id: 'f1e2d3c4-b5a6-9788-6543-21fedcba9876'
    }
  ],
  conditions: [],
  sections: [],
  lists: []
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
    const referenceNumber = `HW-${Date.now()}`

    // Log submission (in production, you'd send to an API or database)
    console.log('✅ Form submitted successfully!')
    console.log('Reference:', referenceNumber)
    console.log(
      'Data:',
      items.map((i) => ({ name: i.name, value: i.value }))
    )

    const yourName = items.find((i) => i.name === 'yourName')?.value || 'there'

    return {
      title: 'Form submitted',
      content: `Your reference number is ${referenceNumber}. Hello, ${yourName}!`
    }
  }
}

const formSubmissionService = {
  submit: async function (payload, request) {
    const reference = `HW-${Date.now()}`

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

export default [{ formsService, outputService, formSubmissionService }]
