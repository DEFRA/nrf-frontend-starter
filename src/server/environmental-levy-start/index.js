import { environmentalLevyStartController } from './controller.js'
import { ROUTES } from '../common/constants/routes.js'

const environmentalLevyStart = {
  plugin: {
    name: 'environmental-levy-start',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: `${ROUTES.FORM}/start`,
          ...environmentalLevyStartController
        }
      ])
    }
  }
}

export { environmentalLevyStart }
