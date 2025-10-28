import { ROUTES } from './routes.js'

/**
 * Start page - Entry point for the Hello World journey
 */
export const startController = {
  handler(_request, h) {
    return h.view('forms/hello-world/views/start', {
      pageTitle: 'Hello World Journey',
      heading: 'Hello World Journey'
    })
  }
}

/**
 * Preference selection - User chooses between "formal" or "casual" greeting
 */
export const getPreferenceController = {
  handler(request, h) {
    const error = request.yar.flash('error')[0]
    return h.view('forms/hello-world/views/preference', {
      pageTitle: 'How would you like to be greeted?',
      heading: 'How would you like to be greeted?',
      error,
      selectedPreference: request.yar.get('preference'),
      backLink: ROUTES.START
    })
  }
}

export const postPreferenceController = {
  handler(request, h) {
    const { preference } = request.payload

    if (!preference) {
      request.yar.flash('error', 'Select how you would like to be greeted')
      return h.redirect(ROUTES.PREFERENCE)
    }

    // Store in session
    request.yar.set('preference', preference)

    // Conditional logic: formal greeting requires a name, casual doesn't
    if (preference === 'formal') {
      return h.redirect(ROUTES.NAME)
    } else {
      return h.redirect(ROUTES.COLOR)
    }
  }
}

/**
 * Name collection - Only shown if user selected "formal" greeting
 */
export const getNameController = {
  handler(request, h) {
    const error = request.yar.flash('error')[0]
    return h.view('forms/hello-world/views/name', {
      pageTitle: 'What is your name?',
      heading: 'What is your name?',
      error,
      name: request.yar.get('name'),
      backLink: ROUTES.PREFERENCE
    })
  }
}

export const postNameController = {
  handler(request, h) {
    const { name } = request.payload

    if (!name || name.trim() === '') {
      request.yar.flash('error', 'Enter your name')
      return h.redirect(ROUTES.NAME)
    }

    request.yar.set('name', name.trim())
    return h.redirect(ROUTES.COLOR)
  }
}

/**
 * Color selection - Available for all users
 */
export const getColorController = {
  handler(request, h) {
    const error = request.yar.flash('error')[0]
    const preference = request.yar.get('preference')

    // Conditional back link: if formal, back to name page; if casual, back to preference
    const backLink = preference === 'formal' ? ROUTES.NAME : ROUTES.PREFERENCE

    return h.view('forms/hello-world/views/color', {
      pageTitle: 'What is your favourite colour?',
      heading: 'What is your favourite colour?',
      error,
      selectedColor: request.yar.get('color'),
      backLink
    })
  }
}

export const postColorController = {
  handler(request, h) {
    const { color } = request.payload

    if (!color) {
      request.yar.flash('error', 'Select your favourite colour')
      return h.redirect(ROUTES.COLOR)
    }

    request.yar.set('color', color)
    return h.redirect(ROUTES.SUMMARY)
  }
}

/**
 * Summary - Review all answers
 */
export const summaryController = {
  handler(request, h) {
    const preference = request.yar.get('preference')
    const name = request.yar.get('name')
    const color = request.yar.get('color')

    // Redirect back to start if no data
    if (!preference) {
      return h.redirect(ROUTES.START)
    }

    return h.view('forms/hello-world/views/summary', {
      pageTitle: 'Check your answers',
      heading: 'Check your answers',
      preference,
      name,
      color,
      ROUTES,
      backLink: ROUTES.COLOR
    })
  }
}

/**
 * Confirmation - Show personalized message based on answers
 */
export const confirmationController = {
  handler(request, h) {
    const preference = request.yar.get('preference')
    const name = request.yar.get('name')
    const color = request.yar.get('color')

    // Redirect back to start if no data
    if (!preference) {
      return h.redirect(ROUTES.START)
    }

    // Generate personalized greeting
    let greeting
    if (preference === 'formal' && name) {
      greeting = `Good day, ${name}!`
    } else {
      greeting = 'Hey there!'
    }

    // Clear session data
    request.yar.reset()

    return h.view('forms/hello-world/views/confirmation', {
      pageTitle: 'Journey complete',
      heading: 'Journey complete',
      greeting,
      color
    })
  }
}
