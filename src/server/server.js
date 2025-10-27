import path from 'path'
import hapi from '@hapi/hapi'
import Scooter from '@hapi/scooter'
import Crumb from '@hapi/crumb'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { router } from './router.js'
import { config } from '../config/config.js'
import { pulse } from './common/helpers/pulse.js'
import { catchAll } from './common/helpers/errors.js'
import { nunjucksConfig } from '../config/nunjucks/nunjucks.js'
import { setupProxy } from './common/helpers/proxy/setup-proxy.js'
import { requestTracing } from './common/helpers/request-tracing.js'
import { requestLogger } from './common/helpers/logging/request-logger.js'
import { sessionCache } from './common/helpers/session-cache/session-cache.js'
import { getCacheEngine } from './common/helpers/session-cache/cache-engine.js'
import { secureContext } from '@defra/hapi-secure-context'
import { contentSecurityPolicy } from './common/helpers/content-security-policy.js'
import formsPlugin from '@defra/forms-engine-plugin'
import { context } from '../config/nunjucks/context/context.js'
import helloWorldServices from './form-examples/hello-world-service.js'
import conditionalRoutingServices from './form-examples/conditional-routing-example-service.js'
import equipmentRegistrationServices from './form-examples/equipment-registration-service.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export async function createServer() {
  setupProxy()
  const server = hapi.server({
    host: config.get('host'),
    port: config.get('port'),
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      },
      files: {
        relativeTo: path.resolve(config.get('root'), '.public')
      },
      security: {
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: false
        },
        xss: 'enabled',
        noSniff: true,
        xframe: true
      }
    },
    router: {
      stripTrailingSlash: true
    },
    cache: [
      {
        name: config.get('session.cache.name'),
        engine: getCacheEngine(config.get('session.cache.engine'))
      }
    ],
    state: {
      strictHeader: false
    }
  })
  await server.register([
    requestLogger,
    requestTracing,
    secureContext,
    pulse,
    sessionCache,
    nunjucksConfig,
    Scooter,
    Crumb,
    contentSecurityPolicy,
    router // Register all the controllers/routes defined in src/server/router.js
  ])

  // Combine all form services
  const allServices = [
    ...helloWorldServices,
    ...conditionalRoutingServices,
    ...equipmentRegistrationServices
  ]

  // Create a merged services object that routes to the correct form
  const formsMap = new Map()

  const mergedServices = {
    formsService: {
      getFormMetadata: async (slug) => {
        for (const service of allServices) {
          try {
            const metadata = await service.formsService.getFormMetadata(slug)
            formsMap.set(metadata.id, service)
            return metadata
          } catch (e) {
            // Try next service
          }
        }
        throw new Error(`Form '${slug}' not found`)
      },
      getFormDefinition: async (id) => {
        for (const service of allServices) {
          try {
            return await service.formsService.getFormDefinition(id)
          } catch (e) {
            // Try next service
          }
        }
        throw new Error(`Form '${id}' not found`)
      }
    },
    outputService: {
      submit: async (
        context,
        request,
        model,
        emailAddress,
        items,
        submitResponse
      ) => {
        const formId = model?.def?.id || model?.formId
        const service = formsMap.get(formId) || allServices[0]
        return await service.outputService.submit(
          context,
          request,
          model,
          emailAddress,
          items,
          submitResponse
        )
      }
    },
    formSubmissionService: {
      submit: async (payload, request) => {
        // Default to first service for submission
        const service = allServices[0]
        return await service.formSubmissionService.submit(payload, request)
      },
      persistFiles: async (context, request, model) => {
        const formId = model?.def?.id || model?.formId
        const service = formsMap.get(formId) || allServices[0]
        return await service.formSubmissionService.persistFiles(
          context,
          request,
          model
        )
      }
    }
  }

  await server.register({
    plugin: formsPlugin,
    options: {
      services: mergedServices,
      nunjucks: {
        baseLayoutPath: 'layouts/page.njk',
        paths: [
          'node_modules/govuk-frontend/dist/',
          'src/server/common/templates',
          'src/server/common/components'
        ]
      },
      viewContext: context,
      baseUrl: `http://localhost:${config.get('port')}`
    }
  })

  server.ext('onPreResponse', catchAll)

  return server
}
