/**
 * A GDS styled example home page controller.
 * Provided as an example, remove or modify as required.
 */
export const homeController = {
  handler(_request, h) {
    return h.view('home/index', {
      pageTitle: 'Examples',
      heading: 'Examples',
      serviceName: 'Nature Restoration Fund User Journey Prototypes',
      serviceUrl: '/'
    })
  }
}
