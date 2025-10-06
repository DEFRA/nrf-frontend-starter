import { QuestionPageController } from '@defra/forms-engine-plugin/controllers/QuestionPageController.js'

/**
 * Generic custom page controller.
 * Can be used for any page that needs custom view logic or sidebar context.
 */
export class CustomPageController extends QuestionPageController {
  constructor(model, pageDef) {
    super(model, pageDef)
    this.viewName = 'development-details-question'
  }

  getSummaryPath() {
    return '/quote'
  }

  /**
   * Override getViewModel to add sidebar data
   */
  getViewModel(formData, errors) {
    const viewModel = super.getViewModel(formData, errors)

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
