import services from '../forms-service.js'

/**
 * A GDS styled example home page controller.
 * Provided as an example, remove or modify as required.
 */
export const homeController = {
  async handler(request, h) {
    // Get submissions from the outputService (it's async!)
    const submissions =
      (await services.outputService?.getSubmissions?.(request)) || []

    return h.view('home/index', {
      pageTitle: 'Home',
      heading: 'Home',
      submissions
    })
  }
}
