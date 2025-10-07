import { STATUS_CODES } from '../constants/status-codes.js'

function statusCodeMessage(statusCode) {
  switch (statusCode) {
    case STATUS_CODES.NOT_FOUND:
      return 'Page not found'
    case STATUS_CODES.FORBIDDEN:
      return 'Forbidden'
    case STATUS_CODES.UNAUTHORIZED:
      return 'Unauthorized'
    case STATUS_CODES.BAD_REQUEST:
      return 'Bad Request'
    default:
      return 'Something went wrong'
  }
}

export function catchAll(request, h) {
  const { response } = request

  if (!('isBoom' in response)) {
    return h.continue
  }

  const statusCode = response.output.statusCode
  const errorMessage = statusCodeMessage(statusCode)

  if (statusCode >= STATUS_CODES.INTERNAL_SERVER_ERROR) {
    request.logger.error(response?.stack)
  }

  return h
    .view('error/index', {
      pageTitle: errorMessage,
      heading: statusCode,
      message: errorMessage
    })
    .code(statusCode)
}
