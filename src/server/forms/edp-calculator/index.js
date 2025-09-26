import { edpApplicationsController } from './controllers/applications-controller.js'
import { edpNewApplicationController } from './controllers/new-application-controller.js'
import {
  edpLocationController,
  edpLocationPostController
} from './controllers/location-controller.js'
import {
  uploadBoundaryController,
  uploadBoundaryPostController,
  enterPostcodeController,
  enterPostcodePostController,
  enterCoordinatesController,
  enterCoordinatesPostController,
  drawMapController,
  drawMapPostController,
  developmentDetailsController,
  developmentDetailsPostController,
  summaryController,
  summaryPostController,
  confirmationController,
  viewApplicationController,
  paymentController,
  paymentPostController,
  paymentConfirmationController
} from './controllers/journey-controllers.js'

export const edpCalculator = {
  plugin: {
    name: 'edp-calculator',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/edp-calculator/applications',
          ...edpApplicationsController
        },
        {
          method: 'GET',
          path: '/edp-calculator/new',
          ...edpNewApplicationController
        },
        {
          method: 'GET',
          path: '/edp-calculator/location',
          ...edpLocationController
        },
        {
          method: 'POST',
          path: '/edp-calculator/location',
          ...edpLocationPostController
        },
        {
          method: 'GET',
          path: '/edp-calculator/upload-boundary',
          ...uploadBoundaryController
        },
        {
          method: 'POST',
          path: '/edp-calculator/upload-boundary',
          ...uploadBoundaryPostController
        },
        {
          method: 'GET',
          path: '/edp-calculator/enter-postcode',
          ...enterPostcodeController
        },
        {
          method: 'POST',
          path: '/edp-calculator/enter-postcode',
          ...enterPostcodePostController
        },
        {
          method: 'GET',
          path: '/edp-calculator/enter-coordinates',
          ...enterCoordinatesController
        },
        {
          method: 'POST',
          path: '/edp-calculator/enter-coordinates',
          ...enterCoordinatesPostController
        },
        {
          method: 'GET',
          path: '/edp-calculator/draw-map',
          ...drawMapController
        },
        {
          method: 'POST',
          path: '/edp-calculator/draw-map',
          ...drawMapPostController
        },
        {
          method: 'GET',
          path: '/edp-calculator/details',
          ...developmentDetailsController
        },
        {
          method: 'POST',
          path: '/edp-calculator/details',
          ...developmentDetailsPostController
        },
        {
          method: 'GET',
          path: '/edp-calculator/summary',
          ...summaryController
        },
        {
          method: 'POST',
          path: '/edp-calculator/summary',
          ...summaryPostController
        },
        {
          method: 'GET',
          path: '/edp-calculator/confirmation',
          ...confirmationController
        },
        {
          method: 'GET',
          path: '/edp-calculator/view/{id}',
          ...viewApplicationController
        },
        {
          method: 'GET',
          path: '/edp-calculator/payment/{id}',
          ...paymentController
        },
        {
          method: 'POST',
          path: '/edp-calculator/payment/{id}',
          ...paymentPostController
        },
        {
          method: 'GET',
          path: '/edp-calculator/payment-confirmation/{id}',
          ...paymentConfirmationController
        }
      ])
    }
  }
}
