import Boom from '@hapi/boom'
import services from '../forms-service.js'
import { routes } from '../common/constants/routes.js'
import { STATUS_TAG_CLASSES } from '../common/constants/submission-status.js'
import { formatCurrency } from '../../config/nunjucks/filters/format-currency.js'

export const statusController = {
  async handler(request, h) {
    let { id } = request.params

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

    const statusTagClass = STATUS_TAG_CLASSES[submission.status] || ''

    return h.view('status/index', {
      pageTitle: `Application ${submission.id}`,
      submission,
      statusTagClass,
      quote: {
        totalLevy: submission.quote.totalLevy,
        totalLevyFormatted: formatCurrency(submission.quote.totalLevy),
        numberOfHouses: submission.quote.numberOfHouses,
        ratePerHouse: submission.quote.ratePerHouse,
        ratePerHouseFormatted: formatCurrency(submission.quote.ratePerHouse)
      },
      routes
    })
  }
}
