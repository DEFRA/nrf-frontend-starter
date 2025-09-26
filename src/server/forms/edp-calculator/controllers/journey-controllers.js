export const uploadBoundaryController = {
  handler(request, h) {
    const crumb = request.plugins?.crumb || ''

    return h.view('forms/edp-calculator/templates/pages/upload-boundary', {
      pageTitle: 'Upload boundary file',
      heading: 'Upload boundary file',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      crumb,
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Applications', href: '/edp-calculator/applications' },
        { text: 'New application', href: '/edp-calculator/new' },
        { text: 'Location', href: '/edp-calculator/location' },
        { text: 'Upload boundary' }
      ]
    })
  }
}

export const uploadBoundaryPostController = {
  handler(request, h) {
    request.yar.set('boundaryUploaded', true)
    return h.redirect('/edp-calculator/details')
  }
}

export const enterPostcodeController = {
  handler(request, h) {
    const crumb = request.plugins?.crumb || ''
    const postcode = request.yar.get('postcode')

    return h.view('forms/edp-calculator/templates/pages/enter-postcode', {
      pageTitle: 'Enter development postcode',
      heading: 'Enter development postcode',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      crumb,
      postcode,
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Applications', href: '/edp-calculator/applications' },
        { text: 'New application', href: '/edp-calculator/new' },
        { text: 'Location', href: '/edp-calculator/location' },
        { text: 'Enter postcode' }
      ]
    })
  }
}

export const enterPostcodePostController = {
  handler(request, h) {
    const { postcode } = request.payload
    const errors = []
    const fieldErrors = {}

    const postcodePattern = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i

    if (!postcode || postcode.trim() === '') {
      errors.push({
        text: 'Enter a postcode',
        href: '#postcode'
      })
      fieldErrors.postcode = { text: 'Enter a postcode' }
    } else if (!postcodePattern.test(postcode.trim())) {
      errors.push({
        text: 'Enter a valid UK postcode',
        href: '#postcode'
      })
      fieldErrors.postcode = { text: 'Enter a valid UK postcode' }
    }

    if (errors.length > 0) {
      const crumb = request.plugins?.crumb || ''

      return h.view('forms/edp-calculator/templates/pages/enter-postcode', {
        pageTitle: 'Enter development postcode',
        heading: 'Enter development postcode',
        serviceName: 'Nature Restoration Fund User Journey Prototypes',
        crumb,
        postcode,
        errors,
        errorList: errors,
        fieldErrors,
        breadcrumbs: [
          { text: 'Home', href: '/' },
          { text: 'Applications', href: '/edp-calculator/applications' },
          { text: 'New application', href: '/edp-calculator/new' },
          { text: 'Location', href: '/edp-calculator/location' },
          { text: 'Enter postcode' }
        ]
      })
    }

    request.yar.set('postcode', postcode.trim().toUpperCase())
    return h.redirect('/edp-calculator/details')
  }
}

export const enterCoordinatesController = {
  handler(request, h) {
    const crumb = request.plugins?.crumb || ''
    const coordinates = request.yar.get('coordinates')

    return h.view('forms/edp-calculator/templates/pages/enter-coordinates', {
      pageTitle: 'Enter site coordinates',
      heading: 'Enter site coordinates',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      crumb,
      coordinates,
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Applications', href: '/edp-calculator/applications' },
        { text: 'New application', href: '/edp-calculator/new' },
        { text: 'Location', href: '/edp-calculator/location' },
        { text: 'Enter coordinates' }
      ]
    })
  }
}

export const enterCoordinatesPostController = {
  handler(request, h) {
    const { latitude, longitude } = request.payload
    const errors = []
    const fieldErrors = {}

    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)

    if (!latitude || latitude.trim() === '') {
      errors.push({
        text: 'Enter a latitude',
        href: '#latitude'
      })
      fieldErrors.latitude = { text: 'Enter a latitude' }
    } else if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push({
        text: 'Enter a valid latitude between -90 and 90',
        href: '#latitude'
      })
      fieldErrors.latitude = {
        text: 'Enter a valid latitude between -90 and 90'
      }
    }

    if (!longitude || longitude.trim() === '') {
      errors.push({
        text: 'Enter a longitude',
        href: '#longitude'
      })
      fieldErrors.longitude = { text: 'Enter a longitude' }
    } else if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push({
        text: 'Enter a valid longitude between -180 and 180',
        href: '#longitude'
      })
      fieldErrors.longitude = {
        text: 'Enter a valid longitude between -180 and 180'
      }
    }

    if (errors.length > 0) {
      const crumb = request.plugins?.crumb || ''

      return h.view('forms/edp-calculator/templates/pages/enter-coordinates', {
        pageTitle: 'Enter site coordinates',
        heading: 'Enter site coordinates',
        serviceName: 'Nature Restoration Fund User Journey Prototypes',
        crumb,
        coordinates: { latitude, longitude },
        errors,
        errorList: errors,
        fieldErrors,
        breadcrumbs: [
          { text: 'Home', href: '/' },
          { text: 'Applications', href: '/edp-calculator/applications' },
          { text: 'New application', href: '/edp-calculator/new' },
          { text: 'Location', href: '/edp-calculator/location' },
          { text: 'Enter coordinates' }
        ]
      })
    }

    request.yar.set('coordinates', { latitude: lat, longitude: lng })
    return h.redirect('/edp-calculator/details')
  }
}

export const drawMapController = {
  handler(request, h) {
    const crumb = request.plugins?.crumb || ''

    return h.view('forms/edp-calculator/templates/pages/draw-map', {
      pageTitle: 'Draw development boundary',
      heading: 'Draw development boundary on map',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      crumb,
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Applications', href: '/edp-calculator/applications' },
        { text: 'New application', href: '/edp-calculator/new' },
        { text: 'Location', href: '/edp-calculator/location' },
        { text: 'Draw boundary' }
      ]
    })
  }
}

export const drawMapPostController = {
  handler(request, h) {
    request.yar.set('mapBoundary', true)
    return h.redirect('/edp-calculator/details')
  }
}

export const developmentDetailsController = {
  handler(request, h) {
    const crumb = request.plugins?.crumb || ''
    const details = request.yar.get('developmentDetails') || {}

    return h.view('forms/edp-calculator/templates/pages/details', {
      pageTitle: 'Development details',
      heading: 'Development details',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      crumb,
      details,
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Applications', href: '/edp-calculator/applications' },
        { text: 'New application', href: '/edp-calculator/new' },
        { text: 'Development details' }
      ]
    })
  }
}

export const developmentDetailsPostController = {
  handler(request, h) {
    const { developmentName, housesCount, developmentType, wastewaterSite } =
      request.payload
    const errors = []
    const fieldErrors = {}

    if (!developmentName || developmentName.trim() === '') {
      errors.push({
        text: 'Enter a development name',
        href: '#developmentName'
      })
      fieldErrors.developmentName = { text: 'Enter a development name' }
    } else if (developmentName.trim().length > 200) {
      errors.push({
        text: 'Development name must be less than 200 characters',
        href: '#developmentName'
      })
      fieldErrors.developmentName = {
        text: 'Development name must be less than 200 characters'
      }
    }

    const houses = parseInt(housesCount, 10)
    if (!housesCount || housesCount === '') {
      errors.push({
        text: 'Enter the number of houses',
        href: '#housesCount'
      })
      fieldErrors.housesCount = { text: 'Enter the number of houses' }
    } else if (isNaN(houses) || houses < 1) {
      errors.push({
        text: 'Enter a valid number of houses',
        href: '#housesCount'
      })
      fieldErrors.housesCount = { text: 'Enter a valid number of houses' }
    } else if (houses > 10000) {
      errors.push({
        text: 'Number of houses must be less than 10,000',
        href: '#housesCount'
      })
      fieldErrors.housesCount = {
        text: 'Number of houses must be less than 10,000'
      }
    }

    if (!developmentType) {
      errors.push({
        text: 'Select a development type',
        href: '#developmentType'
      })
      fieldErrors.developmentType = { text: 'Select a development type' }
    }

    if (!wastewaterSite) {
      errors.push({
        text: 'Select a wastewater treatment site',
        href: '#wastewaterSite'
      })
      fieldErrors.wastewaterSite = {
        text: 'Select a wastewater treatment site'
      }
    }

    if (errors.length > 0) {
      const crumb = request.plugins?.crumb || ''

      return h.view('forms/edp-calculator/templates/pages/details', {
        pageTitle: 'Development details',
        heading: 'Development details',
        serviceName: 'Nature Restoration Fund User Journey Prototypes',
        crumb,
        details: {
          developmentName,
          housesCount,
          developmentType,
          wastewaterSite
        },
        errors,
        errorList: errors,
        fieldErrors,
        breadcrumbs: [
          { text: 'Home', href: '/' },
          { text: 'Applications', href: '/edp-calculator/applications' },
          { text: 'New application', href: '/edp-calculator/new' },
          { text: 'Development details' }
        ]
      })
    }

    request.yar.set('developmentDetails', {
      developmentName: developmentName.trim(),
      housesCount: houses,
      developmentType,
      wastewaterSite
    })
    return h.redirect('/edp-calculator/summary')
  }
}

export const summaryController = {
  handler(request, h) {
    const crumb = request.plugins?.crumb || ''
    const locationMethod = request.yar.get('locationMethod')
    const postcode = request.yar.get('postcode')
    const coordinates = request.yar.get('coordinates')
    const details = request.yar.get('developmentDetails') || {}

    const levyAmount = calculateLevy(details.housesCount || 0)

    return h.view('forms/edp-calculator/templates/pages/summary', {
      pageTitle: 'Check your answers',
      heading: 'Check your answers',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      crumb,
      locationMethod,
      postcode,
      coordinates,
      details,
      levyAmount,
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Applications', href: '/edp-calculator/applications' },
        { text: 'New application', href: '/edp-calculator/new' },
        { text: 'Check your answers' }
      ]
    })
  }
}

export const summaryPostController = {
  handler(request, h) {
    const applicationId = `APP-${Date.now().toString().slice(-6)}`
    const details = request.yar.get('developmentDetails') || {}
    const levyAmount = calculateLevy(details.housesCount || 0)

    const application = {
      id: applicationId,
      date: new Date().toLocaleDateString('en-GB'),
      name: details.developmentName || 'New Development',
      houses: `${details.housesCount || 0} houses`,
      status: 'pending-payment',
      statusText: 'Pending Payment',
      levyAmount
    }

    const applications = request.yar.get('edpApplications') || []
    applications.unshift(application)
    request.yar.set('edpApplications', applications)

    request.yar.clear('locationMethod')
    request.yar.clear('postcode')
    request.yar.clear('coordinates')
    request.yar.clear('developmentDetails')
    request.yar.clear('boundaryUploaded')
    request.yar.clear('mapBoundary')

    return h.redirect('/edp-calculator/confirmation')
  }
}

export const confirmationController = {
  handler(request, h) {
    const applications = request.yar.get('edpApplications') || []
    const latestApplication = applications[0]

    return h.view('forms/edp-calculator/templates/pages/confirmation', {
      pageTitle: 'Application submitted',
      heading: 'Application submitted',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      application: latestApplication
    })
  }
}

export const viewApplicationController = {
  handler(request, h) {
    const { id } = request.params
    const applications = request.yar.get('edpApplications') || []
    const application = applications.find((app) => app.id === id)

    if (!application) {
      return h.redirect('/edp-calculator/applications')
    }

    return h.view('forms/edp-calculator/templates/pages/view-application', {
      pageTitle: 'Application details',
      heading: 'Application details',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      application,
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Applications', href: '/edp-calculator/applications' },
        { text: application.id }
      ]
    })
  }
}

export const paymentController = {
  handler(request, h) {
    const { id } = request.params
    const applications = request.yar.get('edpApplications') || []
    const application = applications.find((app) => app.id === id)

    if (!application) {
      return h.redirect('/edp-calculator/applications')
    }

    const crumb = request.plugins?.crumb || ''

    return h.view('forms/edp-calculator/templates/pages/payment', {
      pageTitle: 'Make payment',
      heading: 'Make payment',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      application,
      crumb,
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Applications', href: '/edp-calculator/applications' },
        { text: 'Payment' }
      ]
    })
  }
}

export const paymentPostController = {
  handler(request, h) {
    const { id } = request.params
    const applications = request.yar.get('edpApplications') || []
    const applicationIndex = applications.findIndex((app) => app.id === id)

    if (applicationIndex !== -1) {
      applications[applicationIndex].status = 'paid'
      applications[applicationIndex].statusText = 'Paid'
      request.yar.set('edpApplications', applications)
    }

    return h.redirect('/edp-calculator/payment-confirmation/' + id)
  }
}

export const paymentConfirmationController = {
  handler(request, h) {
    const { id } = request.params
    const applications = request.yar.get('edpApplications') || []
    const application = applications.find((app) => app.id === id)

    if (!application) {
      return h.redirect('/edp-calculator/applications')
    }

    return h.view('forms/edp-calculator/templates/pages/payment-confirmation', {
      pageTitle: 'Payment successful',
      heading: 'Payment successful',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      application
    })
  }
}

function calculateLevy(housesCount) {
  const levyPerHouse = 2500
  const total = housesCount * levyPerHouse
  return `£${total.toLocaleString('en-GB')}.00`
}
