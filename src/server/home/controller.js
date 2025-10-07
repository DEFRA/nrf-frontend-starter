import services from '../forms-service.js'
import { ROUTES } from '../common/constants/routes.js'

/**
 * A GDS styled example home page controller.
 * Provided as an example, remove or modify as required.
 */
export const homeController = {
  async handler(request, h) {
    const submissions =
      (await services.outputService?.getSubmissions?.(request)) || []

    return h.view('home/index', {
      pageTitle: 'Home',
      heading: 'Home',
      submissions,
      routes: ROUTES
    })
  }
}
