import path from 'path'
import { fileURLToPath } from 'node:url'
import plugin from '@defra/forms-engine-plugin'
import {
  formsService,
  formSubmissionService,
  outputService
} from './forms-service.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Forms module plugin registration
 * Registers the forms-engine-plugin with the server
 */
export const forms = {
  plugin: {
    name: 'forms',
    async register(server, options) {
      // Register the forms-engine-plugin
      await server.register({
        plugin,
        options: {
          services: {
            formsService,
            formSubmissionService,
            outputService
          },
          // Required options for v2.1.3
          nunjucks: {
            baseLayoutPath: path.resolve(
              dirname,
              '../common/templates/layouts/page.njk'
            ),
            paths: [
              'node_modules/govuk-frontend/dist/',
              path.resolve(dirname, '../common/templates'),
              path.resolve(dirname, '../common/components'),
              path.resolve(dirname, '..')
            ]
          },
          viewContext: (request) => ({
            // Add any global view context here
            appName: 'NRF Frontend Starter',
            isProduction: process.env.NODE_ENV === 'production',
            getAssetPath: (asset) => {
              // Map the asset paths to match our webpack output
              if (asset === 'stylesheets/application.scss') {
                return '/public/stylesheets/application.css'
              }
              if (asset === 'application.js') {
                return '/public/javascripts/application.js'
              }
              return `/public/${asset}`
            },
            serviceName: 'NRF Frontend Starter',
            assetPath: '/public/assets',
            manifestPath: '/public/assets/manifest.json'
          }),
          baseUrl: process.env.BASE_URL || 'http://localhost:3000'
        }
      })

      server.logger.info('Forms engine plugin registered successfully')

      // Add any additional forms-specific routes here if needed
      // For example, a route to list all available forms
      server.route({
        method: 'GET',
        path: '/forms',
        options: {
          handler: (request, h) => {
            return h.view('forms/index', {
              pageTitle: 'Available Forms',
              heading: 'Available Forms',
              forms: [
                {
                  slug: 'contact-form',
                  title: 'Contact Form',
                  description: 'Get in touch with our team'
                }
              ]
            })
          }
        }
      })
    }
  }
}
