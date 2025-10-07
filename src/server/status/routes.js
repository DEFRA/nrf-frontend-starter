import { routes } from '../common/constants/routes.js'
import { statusController } from './controller.js'

export default [
  {
    method: 'GET',
    path: `${routes.form}${routes.status}/{id}`,
    ...statusController
  }
]
