import { Endpoints } from '../models/endpoints.enum'
import { UsersController } from '../users/users.controller'

export const endpointsMap = {
  [Endpoints.USERS]: new UsersController(),
}
