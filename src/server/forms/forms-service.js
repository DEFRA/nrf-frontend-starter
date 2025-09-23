import { randomUUID } from 'node:crypto'
import Boom from '@hapi/boom'

const formsRegistry = new Map()
const createMetadata = (slug, title, organisation = 'Defra') => {
  const now = new Date()
  const user = { id: 'system', displayName: 'System' }

  const author = {
    createdAt: now,
    createdBy: user,
    updatedAt: now,
    updatedBy: user
  }

  return {
    id: randomUUID(),
    slug,
    title,
    organisation,
    teamName: 'Development Team',
    teamEmail: 'dev-team@defra.gov.uk',
    submissionGuidance: `
## Form submitted successfully

**Reference number: HDJ2123F**

We have received your contact form and will respond within 5 working days.

### What happens next

We'll review your message and respond to the email address you provided.

**Important:** Check your spam folder if you don't receive a confirmation email within 24 hours.

### What would you like to do?

* [Submit another enquiry](/contact-form)
* [Return to examples page](/)
`,
    notificationEmail: 'submissions@defra.gov.uk',
    ...author,
    live: author
  }
}

export const registerForm = (slug, definition) => {
  const metadata = createMetadata(slug, definition.name)
  formsRegistry.set(slug, {
    metadata,
    definition
  })
  return metadata
}

export const formSubmissionService = {
  /**
   * Persist files (for file upload support)
   * @param {Array} files - Files to persist with format: {fileId: string, initiatedRetrievalKey: string}[]
   * @param {string} persistedRetrievalKey - Retrieval key
   */
  async persistFiles(files, persistedRetrievalKey) {
    // In a real app, save files to S3 or disk
    console.log('Files to persist:', files, 'Key:', persistedRetrievalKey)

    // For now, just return the files array to indicate successful persistence
    return files
  },

  /**
   * Submit form data
   * @param {Object} data - The submission data with structure:
   *   {
   *     sessionId: string,
   *     retrievalKey: string,
   *     main: Array<{name: string, title: string, value: any}>,
   *     repeaters: Array<{name: string, title: string, value: Array}>
   *   }
   */
  async submit(data) {
    console.log('Form submission received:', JSON.stringify(data, null, 2))

    // Validate that we have the expected data structure
    if (
      !data ||
      typeof data.sessionId === 'undefined' ||
      typeof data.retrievalKey === 'undefined'
    ) {
      console.error('Invalid submission data structure:', data)
      throw new Error(
        'Invalid submission data: missing sessionId or retrievalKey'
      )
    }

    // In a real application, you would:
    // 1. Validate the data against the form schema
    // 2. Save to database with proper error handling
    // 3. Send email notifications
    // 4. Integrate with other services
    // 5. Return proper response structure

    // Generate a reference number
    const reference = `REF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    console.log(`Form submitted successfully with reference: ${reference}`)

    // Return the response structure expected by the plugin
    return {
      id: randomUUID(),
      reference,
      sessionId: data.sessionId,
      retrievalKey: data.retrievalKey,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      main: data.main,
      repeaters: data.repeaters || []
    }
  }
}

export const formsService = {
  /**
   * Get form metadata by slug
   * @param {string} slug - The form slug
   * @returns {Promise<Object>} Form metadata
   */
  async getFormMetadata(slug) {
    const form = formsRegistry.get(slug)

    if (!form) {
      throw Boom.notFound(`Form '${slug}' not found`)
    }

    return form.metadata
  },

  /**
   * Get form definition by ID
   * @param {string} id - The form ID
   * @param {string} formState - The form state (draft or live)
   * @returns {Promise<Object>} Form definition
   */
  async getFormDefinition(id, _formState = 'live') {
    // Find form by metadata ID
    for (const form of formsRegistry.values()) {
      if (form.metadata.id === id) {
        return form.definition
      }
    }

    throw Boom.notFound(`Form '${id}' not found`)
  },

  /**
   * Submit form data
   * @param {string} id - The form ID
   * @param {Object} data - The form submission data
   * @returns {Promise<Object>} Submission result
   */
  async submitForm(id, data) {
    console.log('Form submission received:', { id, data })

    // In a real application, you would:
    // 1. Validate the data
    // 2. Save to database
    // 3. Send email notifications
    // 4. Return a reference number

    // For now, just return a success response
    return {
      reference: `REF-${Date.now()}`,
      success: true,
      message: 'Form submitted successfully'
    }
  }
}

const contactFormDefinition = {
  engine: 'V2',
  name: 'Contact Form',
  pages: [
    {
      title: 'Contact Us',
      path: '/contact',
      components: [
        {
          name: 'fullName',
          title: 'Full name',
          type: 'TextField',
          options: {
            classes: 'govuk-input--width-20'
          },
          schema: {
            min: 2,
            max: 100
          },
          validation: {
            required: true
          }
        },
        {
          name: 'email',
          title: 'Email address',
          type: 'EmailAddressField',
          hint: "We'll use this to contact you",
          options: {},
          schema: {},
          validation: {
            required: true
          }
        },
        {
          name: 'subject',
          title: 'Subject',
          type: 'TextField',
          options: {
            classes: 'govuk-input--width-30'
          },
          schema: {
            max: 200
          },
          validation: {
            required: true
          }
        },
        {
          name: 'message',
          title: 'Message',
          type: 'MultilineTextField',
          hint: 'Please provide as much detail as possible',
          options: {
            rows: 8
          },
          schema: {
            max: 2000
          },
          validation: {
            required: true
          }
        }
      ],
      next: [
        {
          path: '/summary'
        }
      ]
    },
    {
      path: '/summary',
      title: 'Check your answers',
      controller: 'SummaryPageController',
      components: [],
      next: [
        {
          path: '/status'
        }
      ]
    }
  ],
  lists: [],
  sections: [],
  conditions: []
}

export const outputService = {
  /**
   * Submit notification - matches the interface from notifyService.js
   * @param {Object} context - Submission context
   * @param {Object} request - Hapi request object
   * @param {Object} model - Form model
   * @param {string} emailAddress - Notification email address
   * @param {Array} items - Form submission items
   * @param {Object} submitResponse - Response from formSubmissionService.submit()
   */
  async submit(_context, request, model, emailAddress, items, submitResponse) {
    const logTags = ['submit', 'notification']

    request.logger.info(logTags, 'Processing output notification', {
      formName: model.name,
      emailAddress,
      reference: submitResponse.reference,
      itemCount: items.length
    })

    try {
      // Log the submission details
      console.log('=== FORM SUBMISSION NOTIFICATION ===')
      console.log('Form:', model.name)
      console.log('Reference:', submitResponse.reference)
      console.log('Email:', emailAddress)
      console.log('Submitted at:', submitResponse.submittedAt)
      console.log('Session ID:', submitResponse.sessionId)

      // Log form data in a readable format
      console.log('\n--- Form Data ---')
      if (submitResponse.main && submitResponse.main.length > 0) {
        submitResponse.main.forEach((item) => {
          console.log(`${item.title}: ${item.value}`)
        })
      }

      if (submitResponse.repeaters && submitResponse.repeaters.length > 0) {
        console.log('\n--- Repeater Data ---')
        submitResponse.repeaters.forEach((repeater) => {
          console.log(`${repeater.title}:`, repeater.value)
        })
      }

      console.log('=====================================\n')

      // In a real application, you would:
      // 1. Send email notification using GOV.UK Notify or similar service
      // 2. Format the submission data appropriately
      // 3. Handle different output audiences (human vs machine)
      // 4. Send to different channels (email, webhook, etc.)
      // 5. Handle retry logic and error states
      // 6. Log audit trail

      // For now, simulate successful notification
      request.logger.info(logTags, 'Notification sent successfully', {
        reference: submitResponse.reference
      })

      // The output service doesn't need to return anything specific
      // The plugin just calls it and continues with the flow
      return {
        success: true,
        reference: submitResponse.reference,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      request.logger.error(logTags, 'Failed to send notification', {
        error: error.message,
        reference: submitResponse.reference
      })

      // Re-throw the error so the form submission fails properly
      throw error
    }
  }
}

registerForm('contact-form', contactFormDefinition)
