export const edpApplicationsController = {
  handler(request, h) {
    // Get applications from session
    const applications = request.yar.get('edpApplications') || []

    // Add mock data for demonstration if no applications exist
    if (applications.length === 0) {
      applications.push(
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
      )
      // Save mock data to session
      request.yar.set('edpApplications', applications)
    }

    return h.view('forms/edp-calculator/templates/pages/applications', {
      pageTitle: 'Your Development Applications',
      heading: 'Your Development Applications',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      applications,
      breadcrumbs: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'Applications'
        }
      ]
    })
  }
}
