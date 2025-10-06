import { QuestionPageController } from '@defra/forms-engine-plugin/controllers/QuestionPageController.js'

/**
 * Mock FileUploadPageController that simulates file upload functionality
 * without requiring an external upload service.
 *
 * For this demo, we simply override the view to display an informational message
 * instead of trying to handle actual file uploads which would require complex
 * integration with the forms engine's FileUploadField component.
 *
 * Updated to fix template rendering issues.
 */
export class MockFileUploadPageController extends QuestionPageController {
  constructor(model, pageDef) {
    super(model, pageDef)

    // Use a custom view for displaying upload information
    this.viewName = 'mock-file-upload'
  }

  getSummaryPath() {
    return '/quote'
  }

  /**
   * Override the get handler to add custom data to the view model
   */
  makeGetRouteHandler() {
    return (request, context, h) => {
      const viewModel = this.getViewModel(request, context)

      // Add custom data about simulated file upload capabilities
      viewModel.uploadInfo = {
        maxFileSize: '10MB',
        acceptedFormats: ['.shp', '.kml', '.geojson', '.json'],
        isSimulated: true,
        message: 'This is a simulated file upload for demonstration purposes'
      }

      // Add some mock uploaded files if they exist in state
      const { state } = context
      const uploadedFiles = state.uploadedFiles || []
      viewModel.uploadedFiles = uploadedFiles

      return h.view(this.viewName, viewModel)
    }
  }

  /**
   * Override the post handler to simulate file upload
   */
  makePostRouteHandler() {
    const originalHandler = super.makePostRouteHandler()

    return async (request, context, h) => {
      const { payload } = request
      const { state } = context

      // Check if this is a simulation button click (not actual file upload)
      if (payload && payload.simulateUpload === 'true') {
        // Generate random file names for variety
        const fileNames = [
          'site-boundary.geojson',
          'development-area.kml',
          'plot-outline.shp',
          'building-footprint.json',
          'land-registry.geojson'
        ]

        const randomName =
          fileNames[Math.floor(Math.random() * fileNames.length)]
        const randomSize = Math.floor(Math.random() * 100000) + 10000 // 10KB to 100KB

        // Create mock file metadata
        const mockFile = {
          id: `mock-${Date.now()}`,
          filename: randomName,
          size: randomSize,
          type:
            randomName.endsWith('.json') || randomName.endsWith('.geojson')
              ? 'application/geo+json'
              : randomName.endsWith('.kml')
                ? 'application/vnd.google-earth.kml+xml'
                : 'application/octet-stream',
          uploadedAt: new Date().toISOString()
        }

        // Store in state
        const uploadedFiles = state.uploadedFiles || []
        uploadedFiles.push(mockFile)

        await this.mergeState(request, state, {
          uploadedFiles: uploadedFiles.slice(-5) // Keep only last 5 files
        })

        // Log the simulated upload
        request.logger.info('Mock file upload simulated', {
          filename: mockFile.filename,
          size: mockFile.size
        })

        // Redirect back to the same page to show the uploaded files
        return h.redirect(request.path)
      }

      // Continue with normal form processing for the Continue button
      return originalHandler(request, context, h)
    }
  }
}
