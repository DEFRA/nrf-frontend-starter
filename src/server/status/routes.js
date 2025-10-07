import { ROUTES } from '../common/constants/routes.js'
import { statusController } from './controller.js'

export default [
  {
    method: 'GET',
    path: `${ROUTES.FORM}${ROUTES.STATUS}/{id}`,
    ...statusController
  }
]
