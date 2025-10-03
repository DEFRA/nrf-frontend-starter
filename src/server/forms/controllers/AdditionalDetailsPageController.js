import { QuestionPageController } from '@defra/forms-engine-plugin/controllers/QuestionPageController.js'

/**
 * Controller for the Additional Development Details page.
 * This page collects development name and number of houses,
 * and displays a sidebar with development location summary.
 */
export class AdditionalDetailsPageController extends QuestionPageController {
  constructor(model, pageDef) {
    super(model, pageDef)
    // Override the view to use our custom template
    this.viewName = 'additional-development-details'
  }

  getSummaryPath() {
    return '/quote'
  }

  /**
   * Override getViewModel to add sidebar data
   */
  getViewModel(formData, errors) {
    const viewModel = super.getViewModel(formData, errors)

    // Add sidebar context with development location summary
    viewModel.sidebarContext = {
      location: {
        coordinates: '51.5, -0.4',
        boundary: 'Provided'
      },
      applicableEDPs: [
        {
          code: 'DLL',
          name: 'District Level Licensing - Thames Valley'
        }
      ],
      treatmentSites: '5 sites within 50 miles'
    }

    return viewModel
  }
}
