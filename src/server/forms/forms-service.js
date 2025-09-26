import { randomUUID } from 'node:crypto'
import Boom from '@hapi/boom'

import { contactDefinition } from './basic/contact/definition.js'
import { conditionalRoutingDemoDefinition } from './basic/conditional/definition.js'
import { edpLevyDefinition } from './advanced/edp-levy/definition.js'

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
   * @param {Object} request - Hapi request object (for session access)
   */
  async submit(data, request) {
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

    // Generate a reference number
    const appId = `APP-${Date.now().toString().slice(-3)}`
    const reference = `REF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    console.log(`Form submitted successfully with reference: ${reference}`)

    // For EDP Levy form, save to session for persistence
    if (data.retrievalKey && data.retrievalKey.includes('edp-levy')) {
      // Extract form data
      const formData = {}
      if (data.main && Array.isArray(data.main)) {
        data.main.forEach((item) => {
          formData[item.name] = item.value
        })
      }

      // Calculate levy amount based on number of houses
      const houses = parseInt(formData.numberOfHouses) || 100
      const levyPerHouse = 2500 // £2,500 per house as shown in screenshot
      const levyAmount = houses * levyPerHouse

      // Create application object
      const application = {
        id: appId,
        date: new Date().toLocaleDateString('en-GB'),
        name: formData.developmentName || 'New Development',
        houses: `${houses} houses`,
        status:
          formData.paymentChoice === 'pay-now'
            ? 'pending-payment'
            : 'submitted',
        statusText:
          formData.paymentChoice === 'pay-now'
            ? 'Pending Payment'
            : 'Submitted',
        levyAmount: `£${levyAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }

      // Get existing applications from session
      if (request && request.yar) {
        const existingApplications =
          request.yar.get('edpLevyApplications') || []

        // Add new application to the beginning of the list
        existingApplications.unshift(application)

        // Save back to session
        request.yar.set('edpLevyApplications', existingApplications)

        console.log('Application saved to session:', application)
      }
    }

    // Return the response structure expected by the plugin
    return {
      id: randomUUID(),
      reference,
      appId,
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

      // For EDP Levy form, save to session for persistence
      if (model.name === 'EDP Levy Calculator' && request.yar) {
        // Extract form data from submitResponse
        const formData = {}
        if (submitResponse.main && Array.isArray(submitResponse.main)) {
          submitResponse.main.forEach((item) => {
            // Use the field name as key
            formData[item.name] = item.value
          })
        }

        console.log('Form data extracted from submitResponse:', formData)

        // For V1 forms, check the session under the form ID
        const formId = 'aaaa1111-bbbb-2222-cccc-333344445555'
        const formState = request.yar.get(formId) || {}

        console.log('V1 Form state from session:', formState)

        // Use the actual field names from the form
        const numberOfHouses =
          formData.numberOfHouses || formState.numberOfHouses || 100
        const developmentName =
          formData.developmentName ||
          formState.developmentName ||
          'New Development'

        // Create application object
        const application = {
          id: `APP-${String(Math.floor(Math.random() * 10000)).padStart(3, '0')}`,
          date: new Date().toLocaleDateString('en-GB'),
          name: developmentName,
          houses: `${numberOfHouses} houses`,
          status: 'pending-payment',
          statusText: 'Pending Payment',
          levyAmount: '£85,000.00'
        }

        // Get existing applications from session
        const existingApplications =
          request.yar.get('edpLevyApplications') || []

        // Add new application to the beginning of the list
        existingApplications.unshift(application)

        // Save back to session
        request.yar.set('edpLevyApplications', existingApplications)

        console.log(
          'Application saved to session via outputService:',
          application
        )
      }

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

const contactMetadata = createMetadata('contact', contactDefinition.name)
contactMetadata.id = 'contact-form-uuid-1234-5678-90ab-cdef12345678'
formsRegistry.set('contact', {
  metadata: contactMetadata,
  definition: contactDefinition
})

const edpLevyMetadata = createMetadata('edp-levy', edpLevyDefinition.name)
edpLevyMetadata.id = 'aaaa1111-bbbb-2222-cccc-333344445555'
edpLevyMetadata.notificationEmail = 'edp-levy@defra.gov.uk'
formsRegistry.set('edp-levy', {
  metadata: edpLevyMetadata,
  definition: edpLevyDefinition
})

const conditionalRoutingMetadata = createMetadata(
  'conditional-routing',
  conditionalRoutingDemoDefinition.name
)
conditionalRoutingMetadata.id = 'dddd4444-eeee-5555-ffff-666677778888'
formsRegistry.set('conditional-routing', {
  metadata: conditionalRoutingMetadata,
  definition: conditionalRoutingDemoDefinition
})
