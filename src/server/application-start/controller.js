const applicationStartController = {
  handler: (request, h) => {
    return h.view('application-start/index')
  }
}

export { applicationStartController }
