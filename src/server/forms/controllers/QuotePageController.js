import { SummaryPageController } from '@defra/forms-engine-plugin/controllers/SummaryPageController.js'

/**
 * Controller for the Quote page.
 * Extends SummaryPageController to show a quote with calculated levy
 * instead of a standard summary page.
 */
export class QuotePageController extends SummaryPageController {
  constructor(model, pageDef) {
    super(model, pageDef)
    // Override the view to use our custom template
    this.viewName = 'quote-page'
  }

  /**
   * Calculate the environmental levy based on number of houses
   * @param {Object} state - Form state containing all field values
   * @returns {number} Calculated levy amount
   */
  calculateLevy(state) {
    const numberOfHouses = parseInt(state?.numberOfHouses || 0, 10)
    const ratePerHouse = 2500 // £2,500 per house for DLL
    return numberOfHouses * ratePerHouse
  }

  /**
   * Format number as GBP currency
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  getSummaryPath() {
    return '/quote'
  }

  /**
   * Override getSummaryViewModel to add quote calculation and context
   */
  getSummaryViewModel(request, context) {
    const viewModel = super.getSummaryViewModel(request, context)
    const { state } = context

    // Calculate levy
    const levy = this.calculateLevy(state)
    const numberOfHouses = parseInt(state?.numberOfHouses || 0, 10)
    const ratePerHouse = 2500

    // Add quote-specific context
    viewModel.quote = {
      totalLevy: levy,
      totalLevyFormatted: this.formatCurrency(levy),
      numberOfHouses,
      ratePerHouse,
      ratePerHouseFormatted: this.formatCurrency(ratePerHouse),
      edpBreakdown: [
        {
          type: 'DLL',
          description: 'District Level Licensing - Thames Valley',
          ratePerHouse,
          ratePerHouseFormatted: this.formatCurrency(ratePerHouse),
          amount: levy,
          amountFormatted: this.formatCurrency(levy)
        }
      ]
    }

    // Add "What happens next" steps
    viewModel.nextSteps = [
      'Review your quote',
      'Accept the terms',
      'Complete payment',
      'Receive confirmation'
    ]

    // Remove returnUrl from location method field so changing it routes to the appropriate input page
    // instead of back to the quote page
    if (viewModel.checkAnswers) {
      viewModel.checkAnswers.forEach((section) => {
        section.summaryList?.rows?.forEach((row) => {
          const href = row.actions?.items?.[0]?.href
          if (
            href &&
            href.includes(
              'how-would-you-like-to-provide-your-development-site-location'
            )
          ) {
            row.actions.items[0].href = href.split('?')[0]
          }
        })
      })
    }

    return viewModel
  }
}
