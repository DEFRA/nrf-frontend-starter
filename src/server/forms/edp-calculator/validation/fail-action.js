export const validationFailAction = (viewPath, breadcrumbs) => {
  return async (request, h, error) => {
    const errors = []
    const fieldErrors = {}

    if (error.details) {
      for (const detail of error.details) {
        const fieldName = detail.path[0]
        const message = detail.message

        errors.push({
          text: message,
          href: `#${fieldName}`
        })

        fieldErrors[fieldName] = { text: message }
      }
    }

    const crumb = request.plugins?.crumb || ''
    const payload = request.payload || {}

    return h
      .view(viewPath, {
        ...(request.route.settings.plugins?.viewContext || {}),
        ...payload,
        crumb,
        errors,
        errorList: errors,
        fieldErrors,
        breadcrumbs
      })
      .code(400)
      .takeover()
  }
}
