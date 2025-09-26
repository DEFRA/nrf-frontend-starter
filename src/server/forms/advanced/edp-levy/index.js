const edpLevyApplicationsController = {
  handler(request, h) {
    // Hardcoded sample applications
    const hardcodedApplications = [
      {
        id: 'APP-001',
        date: '15/01/2024',
        name: 'Riverside Housing Development',
        houses: '150 houses',
        status: 'pending-payment',
        statusText: 'Pending Payment',
        levyAmount: '£375,000.00'
      },
      {
        id: 'APP-002',
        date: '10/01/2024',
        name: 'South East Residential Complex',
        houses: '200 houses',
        status: 'paid',
        statusText: 'Paid',
        levyAmount: '£900,000.00'
      },
      {
        id: 'APP-003',
        date: '05/01/2024',
        name: 'Hampshire Coastal Development',
        houses: '75 houses',
        status: 'approved',
        statusText: 'Approved',
        levyAmount: '£112,500.00'
      }
    ]

    // Get applications from session
    const sessionApplications = request.yar.get('edpLevyApplications') || []

    // Combine session applications (shown first) with hardcoded ones
    const applications = [...sessionApplications, ...hardcodedApplications]

    return h.view('forms/advanced/edp-levy/templates/applications', {
      pageTitle: 'Your Development Applications',
      heading: 'Your Development Applications',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      applications
    })
  }
}

const edpLevyNewController = {
  handler(request, h) {
    // Clear any current application when starting a new one
    request.yar.clear('currentEdpApplication')

    // Also clear the form state to start fresh
    const formId = 'aaaa1111-bbbb-2222-cccc-333344445555'
    request.yar.clear(formId)

    return h.view('forms/advanced/edp-levy/templates/new', {
      pageTitle: 'Start a new application',
      heading: 'Start a new application',
      serviceName: 'Nature Restoration Fund User Journey Prototypes'
    })
  }
}

const edpLevyConfirmationController = {
  handler(request, h) {
    // Get form state from session - V1 forms store data under the form ID
    const formId = 'aaaa1111-bbbb-2222-cccc-333344445555'
    const formState = request.yar.get(formId) || {}

    console.log(
      'EDP Levy Confirmation - Form state:',
      JSON.stringify(formState, null, 2)
    )

    // Extract values from form state
    const numberOfHouses = formState.numberOfHouses || 100
    const developmentName = formState.developmentName || 'New Development'
    const developmentType = formState.developmentType || 'residential'
    const locationMethod = formState.locationMethod || 'postcode'
    const postcode = formState.postcode || 'SW1A 2AA'
    const wastewaterTreatment = formState.wastewaterTreatment || 'other'
    const edpType = formState.edpType || 'dll'

    // Calculate levy amount
    const levyPerHouse = 2500
    const levyAmount = numberOfHouses * levyPerHouse

    // Check if we already have a saved application for this session
    let application = request.yar.get('currentEdpApplication')

    if (!application) {
      // Generate a unique reference
      const appId = `APP-${String(Math.floor(Math.random() * 10000)).padStart(3, '0')}`

      // Create application object
      application = {
        id: appId,
        date: new Date().toLocaleDateString('en-GB'),
        name: developmentName,
        houses: `${numberOfHouses} houses`,
        status: 'pending-payment',
        statusText: 'Pending Payment',
        levyAmount: `£${levyAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        developmentType,
        locationMethod,
        postcode,
        wastewaterTreatment,
        edpType
      }

      // Save application to session for persistence
      const existingApplications = request.yar.get('edpLevyApplications') || []
      existingApplications.unshift(application)
      request.yar.set('edpLevyApplications', existingApplications)
      request.yar.set('currentEdpApplication', application)

      console.log('New application saved:', application)
    } else {
      console.log('Using existing application:', application)
    }

    // Clear the current application after displaying (for next submission)
    // Don't clear immediately - do it on the next form start

    return h.view('forms/advanced/edp-levy/templates/confirmation', {
      pageTitle: 'Application submitted',
      heading: 'Application submitted',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      application
    })
  }
}

const edpLevyViewController = {
  handler(request, h) {
    const { id } = request.params

    // Hardcoded sample applications (same as in applications controller)
    const hardcodedApplications = [
      {
        id: 'APP-001',
        date: '15/01/2024',
        name: 'Riverside Housing Development',
        houses: '150 houses',
        status: 'pending-payment',
        statusText: 'Pending Payment',
        levyAmount: '£375,000.00'
      },
      {
        id: 'APP-002',
        date: '10/01/2024',
        name: 'South East Residential Complex',
        houses: '200 houses',
        status: 'paid',
        statusText: 'Paid',
        levyAmount: '£900,000.00'
      },
      {
        id: 'APP-003',
        date: '05/01/2024',
        name: 'Hampshire Coastal Development',
        houses: '75 houses',
        status: 'approved',
        statusText: 'Approved',
        levyAmount: '£112,500.00'
      }
    ]

    // Get applications from session
    const sessionApplications = request.yar.get('edpLevyApplications') || []

    // Combine all applications
    const allApplications = [...sessionApplications, ...hardcodedApplications]

    // Find the application by ID
    const application = allApplications.find((app) => app.id === id)

    if (!application) {
      return h.response('Application not found').code(404)
    }

    return h.view('forms/advanced/edp-levy/templates/view', {
      pageTitle: `Application ${id}`,
      heading: 'View application',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      application
    })
  }
}

export const edpLevy = {
  plugin: {
    name: 'edp-levy',
    register(server) {
      // Register regular routes for non-form pages
      server.route([
        {
          method: 'GET',
          path: '/edp-levy/applications',
          ...edpLevyApplicationsController
        },
        {
          method: 'GET',
          path: '/edp-levy/new',
          ...edpLevyNewController
        },
        {
          method: 'GET',
          path: '/edp-levy/view/{id}',
          ...edpLevyViewController
        },
        {
          method: 'GET',
          path: '/edp-levy/confirmation',
          ...edpLevyConfirmationController
        }
      ])
    }
  }
}
