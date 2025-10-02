import { QuestionPageController } from '@defra/forms-engine-plugin/controllers/QuestionPageController.js'

/**
 * MapDrawingController
 *
 * Custom controller for the map drawing page that allows users to draw
 * polygon boundaries on an interactive Leaflet map.
 *
 * Handles state restoration when users navigate back or click "Change"
 * from the summary page.
 */
export class MapDrawingController extends QuestionPageController {
  constructor(model, pageDef) {
    super(model, pageDef)
    // Override the view to use our custom template
    this.viewName = 'map-drawing'
  }

  /**
   * Get view model with existing coordinates for state restoration
   */
  getViewModel(request, context) {
    const viewModel = super.getViewModel(request, context)

    // Get existing coordinates from context payload (field name: NiAeAB)
    const existingCoordinates = context?.payload?.NiAeAB

    // Pass coordinates to the view if they exist
    if (existingCoordinates) {
      try {
        // Parse coordinates if they're a JSON string
        const coordinates = typeof existingCoordinates === 'string'
          ? JSON.parse(existingCoordinates)
          : existingCoordinates

        viewModel.existingCoordinates = coordinates
      } catch (e) {
        // If parsing fails, coordinates will be undefined
        console.error('Failed to parse existing coordinates:', e)
      }
    }

    return viewModel
  }
}
