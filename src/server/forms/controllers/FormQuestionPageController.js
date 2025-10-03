import { QuestionPageController } from '@defra/forms-engine-plugin/controllers/QuestionPageController.js'

/**
 * Base controller for all question pages in this form.
 * Overrides getSummaryPath to return the quote page path instead of /summary.
 */
export class FormQuestionPageController extends QuestionPageController {
  getSummaryPath() {
    return '/quote'
  }
}
