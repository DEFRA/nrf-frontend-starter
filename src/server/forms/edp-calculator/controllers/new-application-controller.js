export const edpNewApplicationController = {
  handler(request, h) {
    return h.view('forms/edp-calculator/templates/pages/new-application', {
      pageTitle: 'Submit a new development application',
      heading: 'Submit a new development application',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
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
          text: 'New application'
        }
      ]
    })
  }
}
