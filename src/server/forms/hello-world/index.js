import { ROUTES } from './routes.js'
import {
  startController,
  getPreferenceController,
  postPreferenceController,
  getNameController,
  postNameController,
  getColorController,
  postColorController,
  summaryController,
  confirmationController
} from './controller.js'

/**
 * Sets up the routes for the Hello World journey.
 * Demonstrates conditional logic based on user selections.
 */
export const helloWorld = {
  plugin: {
    name: 'hello-world',
    register(server) {
      server.route([
        // Start page
        {
          method: 'GET',
          path: ROUTES.START,
          ...startController
        },
        // Preference selection
        {
          method: 'GET',
          path: ROUTES.PREFERENCE,
          ...getPreferenceController
        },
        {
          method: 'POST',
          path: ROUTES.PREFERENCE,
          ...postPreferenceController
        },
        // Name collection (conditional - only for formal greeting)
        {
          method: 'GET',
          path: ROUTES.NAME,
          ...getNameController
        },
        {
          method: 'POST',
          path: ROUTES.NAME,
          ...postNameController
        },
        // Color selection
        {
          method: 'GET',
          path: ROUTES.COLOR,
          ...getColorController
        },
        {
          method: 'POST',
          path: ROUTES.COLOR,
          ...postColorController
        },
        // Summary
        {
          method: 'GET',
          path: ROUTES.SUMMARY,
          ...summaryController
        },
        // Confirmation
        {
          method: 'GET',
          path: ROUTES.CONFIRMATION,
          ...confirmationController
        }
      ])
    }
  }
}
