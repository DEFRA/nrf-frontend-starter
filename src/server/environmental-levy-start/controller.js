import { ROUTES } from '../common/constants/routes.js'

const environmentalLevyStartController = {
  handler: (request, h) => {
    return h.view('environmental-levy-start/index', {
      routes: ROUTES
    })
  }
}

export { environmentalLevyStartController }
