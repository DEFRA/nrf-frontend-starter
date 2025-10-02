import {
  createAll,
  Button,
  Checkboxes,
  ErrorSummary,
  Header,
  Radios,
  SkipLink
} from 'govuk-frontend'
import { initializeMapDrawing } from '../../features/map-drawing/client/map-drawing.js'

// Initialize GOV.UK Frontend components
createAll(Button)
createAll(Checkboxes)
createAll(ErrorSummary)
createAll(Header)
createAll(Radios)
createAll(SkipLink)

// Initialize map drawing feature
initializeMapDrawing()
