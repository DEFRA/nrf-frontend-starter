import { applicationStartController } from './controller.js'

const applicationStart = {
  plugin: {
    name: 'application-start',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/application/start',
          ...applicationStartController
        }
      ])
    }
  }
}

export { applicationStart }