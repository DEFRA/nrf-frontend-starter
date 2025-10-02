import services from '../forms-service.js'

/**
 * A GDS styled example home page controller.
 * Provided as an example, remove or modify as required.
 */
export const homeController = {
  async handler(request, h) {
    // Get submissions from the outputService (it's async!)
    const submissions =
      (await services.outputService?.getSubmissions?.(request)) || []

    // Parse polygon coordinates for display
    const submissionsWithParsedCoordinates = submissions.map((submission) => {
      if (
        submission.formData &&
        submission.formData['NiAeAB'] &&
        submission.formData['NiAeAB'].value
      ) {
        try {
          const coordinates = JSON.parse(submission.formData['NiAeAB'].value)
          return {
            ...submission,
            polygonCoordinates: Array.isArray(coordinates) ? coordinates : null
          }
        } catch (e) {
          // If parsing fails, just return the submission as-is
          return submission
        }
      }
      return submission
    })

    return h.view('home/index', {
      pageTitle: 'Home',
      heading: 'Home',
      submissions: submissionsWithParsedCoordinates
    })
  }
}
