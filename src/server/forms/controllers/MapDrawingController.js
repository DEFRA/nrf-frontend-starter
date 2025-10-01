import { QuestionPageController } from '@defra/forms-engine-plugin/controllers/QuestionPageController.js'

export class MapDrawingController extends QuestionPageController {
  constructor(model, pageDef) {
    super(model, pageDef)
    // Override the view to use our custom template
    this.viewName = 'map-drawing'
  }
}
