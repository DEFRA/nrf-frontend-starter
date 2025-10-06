import { environmentalLevyStartController } from './controller.js'
import { routes } from '../common/constants/routes.js'

const environmentalLevyStart = {
  plugin: {
    name: 'environmental-levy-start',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: `${routes.form}/start`,
          ...environmentalLevyStartController
        }
      ])
    }
  }
}

export { environmentalLevyStart }
