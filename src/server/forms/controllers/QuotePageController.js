import { SummaryPageController } from '@defra/forms-engine-plugin/controllers/SummaryPageController.js'
import { formatCurrency } from '../../../config/nunjucks/filters/format-currency.js'
import { routes } from '../../common/constants/routes.js'
import { formIds } from '../../common/constants/form-ids.js'
import { LEVY_RATES } from '../../common/constants/levy-rates.js'

/**
 * Controller for the Quote page.
 * Extends SummaryPageController to show a quote with calculated levy
 * instead of a standard summary page.
 */
export class QuotePageController extends SummaryPageController {
  constructor(model, pageDef) {
    super(model, pageDef)
    this.viewName = 'quote-page'
  }

  /**
   * Calculate the environmental levy based on number of houses
   * @param {Object} state - Form state containing all field values
   * @returns {number} Calculated levy amount
   */
  calculateLevy(state) {
    const numberOfHouses = parseInt(state?.[formIds.numberOfHouses] || 0, 10)
    return numberOfHouses * LEVY_RATES.DLL_RATE_PER_HOUSE
  }

  getSummaryPath() {
    return routes.quote
  }

  getStatusPath() {
    return `${routes.status}/latest`
  }

  /**
   * Override getSummaryViewModel to add quote calculation and context
   */
  getSummaryViewModel(request, context) {
    const viewModel = super.getSummaryViewModel(request, context)
    const { state } = context

    const levy = this.calculateLevy(state)
    const numberOfHouses = parseInt(state?.[formIds.numberOfHouses] || 0, 10)
    const ratePerHouse = LEVY_RATES.DLL_RATE_PER_HOUSE

    viewModel.quote = {
      totalLevy: levy,
      totalLevyFormatted: formatCurrency(levy),
      numberOfHouses,
      ratePerHouse,
      ratePerHouseFormatted: formatCurrency(ratePerHouse),
      edpBreakdown: [
        {
          type: 'DLL',
          description: 'District Level Licensing - Thames Valley',
          ratePerHouse,
          ratePerHouseFormatted: formatCurrency(ratePerHouse),
          amount: levy,
          amountFormatted: formatCurrency(levy)
        }
      ]
    }

    viewModel.nextSteps = [
      'Review your quote',
      'Accept the terms',
      'Complete payment',
      'Receive confirmation'
    ]

    if (viewModel.checkAnswers) {
      viewModel.checkAnswers.forEach((section) => {
        section.summaryList?.rows?.forEach((row) => {
          const href = row.actions?.items?.[0]?.href
          if (href && href.includes(routes.locationMethod)) {
            row.actions.items[0].href = href.split('?')[0]
          }
        })
      })
    }

    return viewModel
  }
}
