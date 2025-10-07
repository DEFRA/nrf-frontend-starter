import inert from '@hapi/inert'

import { home } from './home/index.js'
import { about } from './about/index.js'
import { health } from './health/index.js'
import { environmentalLevyStart } from './environmental-levy-start/index.js'
import { status } from './status/index.js'
import { serveStaticFiles } from './common/helpers/serve-static-files.js'

export const router = {
  plugin: {
    name: 'router',
    async register(server) {
      await server.register([inert])

      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      await server.register([home, about, environmentalLevyStart, status])
      await server.register([serveStaticFiles])
    }
  }
}
