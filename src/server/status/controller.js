import Boom from '@hapi/boom'
import services from '../forms-service.js'
import { routes } from '../common/constants/routes.js'
import { formatCurrency } from '../../config/nunjucks/filters/format-currency.js'

export const statusController = {
  async handler(request, h) {
    let { id } = request.params

    // Handle 'latest' as a special case to get the most recent submission
    if (id === 'latest') {
      const submissions = await services.outputService.getSubmissions(request)
      if (submissions.length === 0) {
        throw Boom.notFound('No submissions found')
      }
      const latestSubmission = submissions[submissions.length - 1]
      id = latestSubmission.id
    }

    const submission = await services.outputService.getSubmissionById(
      request,
      id
    )

    const numberOfHouses = parseInt(
      submission.formData?.numberOfHouses?.value || 0,
      10
    )
    const ratePerHouse = 2500

    const statusTagClass =
      submission.status === 'Pending Payment'
        ? 'govuk-tag--orange'
        : submission.status === 'Paid'
          ? 'govuk-tag--blue'
          : submission.status === 'Approved'
            ? 'govuk-tag--green'
            : ''

    return h.view('status/index', {
      pageTitle: `Application ${submission.id}`,
      submission,
      statusTagClass,
      quote: {
        totalLevy: submission.levy,
        totalLevyFormatted: formatCurrency(submission.levy),
        numberOfHouses,
        ratePerHouse,
        ratePerHouseFormatted: formatCurrency(ratePerHouse)
      },
      routes
    })
  }
}
