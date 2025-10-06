import statusRoutes from './routes.js'

export const status = {
  plugin: {
    name: 'status',
    register: async (server) => {
      server.route(statusRoutes)
    }
  }
}
