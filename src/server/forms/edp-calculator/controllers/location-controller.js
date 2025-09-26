export const edpLocationController = {
  handler(request, h) {
    const locationMethod = request.yar.get('locationMethod')
    const crumb = request.plugins?.crumb || ''

    return h.view('forms/edp-calculator/templates/pages/location', {
      pageTitle:
        'How would you like to provide your development site location?',
      heading: 'How would you like to provide your development site location?',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      locationMethod,
      crumb,
      breadcrumbs: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'Applications',
          href: '/edp-calculator/applications'
        },
        {
          text: 'New application',
          href: '/edp-calculator/new'
        },
        {
          text: 'Location'
        }
      ]
    })
  }
}

export const edpLocationPostController = {
  handler(request, h) {
    const { locationMethod } = request.payload
    const errors = []

    if (!locationMethod) {
      errors.push({
        text: 'Select how you want to provide your development site location',
        href: '#location-method'
      })
    }

    if (errors.length > 0) {
      const crumb = request.plugins?.crumb || ''
      return h.view('forms/edp-calculator/templates/pages/location', {
        pageTitle:
          'How would you like to provide your development site location?',
        heading:
          'How would you like to provide your development site location?',
        serviceName: 'Nature Restoration Fund User Journey Prototypes',
        locationMethod,
        crumb,
        errors,
        errorList: errors,
        breadcrumbs: [
          { text: 'Home', href: '/' },
          { text: 'Applications', href: '/edp-calculator/applications' },
          { text: 'New application', href: '/edp-calculator/new' },
          { text: 'Location' }
        ]
      })
    }

    request.yar.set('locationMethod', locationMethod)

    let nextPath = '/edp-calculator/details'

    switch (locationMethod) {
      case 'upload':
        nextPath = '/edp-calculator/upload-boundary'
        break
      case 'postcode':
        nextPath = '/edp-calculator/enter-postcode'
        break
      case 'coordinates':
        nextPath = '/edp-calculator/enter-coordinates'
        break
      case 'draw':
        nextPath = '/edp-calculator/draw-map'
        break
    }

    return h.redirect(nextPath)
  }
}
