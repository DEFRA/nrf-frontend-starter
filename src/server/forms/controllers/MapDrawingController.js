import { QuestionPageController } from '@defra/forms-engine-plugin/controllers/QuestionPageController.js'

export class MapDrawingController extends QuestionPageController {
  constructor(model, pageDef) {
    super(model, pageDef)
    this.viewName = 'map-drawing'
  }

  getSummaryPath() {
    return '/quote'
  }
}
