import { routes } from '../common/constants/routes.js'

const environmentalLevyStartController = {
  handler: (request, h) => {
    return h.view('environmental-levy-start/index', {
      routes
    })
  }
}

export { environmentalLevyStartController }
