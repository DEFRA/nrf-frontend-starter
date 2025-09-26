import inert from '@hapi/inert'

import { home } from './home/index.js'
import { about } from './about/index.js'
import { health } from './health/index.js'
import { forms } from './forms/index.js'
import { edpCalculator } from './forms/edp-calculator/index.js'
import { edpLevy } from './forms/advanced/edp-levy/index.js'
import { serveStaticFiles } from './common/helpers/serve-static-files.js'

export const router = {
  plugin: {
    name: 'router',
    async register(server) {
      await server.register([inert])

      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      // Application specific routes, add your own routes here
      const plugins = [home, about, edpCalculator, edpLevy]

      // Only register forms plugin if not in test environment
      // The forms-engine-plugin v2.1.3 has an issue with its internal logger import
      // that causes tests to fail
      if (process.env.NODE_ENV !== 'test') {
        plugins.push(forms)
      }

      await server.register(plugins)

      // Static assets
      await server.register([serveStaticFiles])
    }
  }
}
