import { ErrorMessages } from '../models/error-messages.enum'
import { StatusCodes } from '../models/status-codes.enum'
import { APIError } from './api.error'

export class UserNotFoundError extends APIError {
  constructor() {
    super(ErrorMessages.USER_NOT_FOUND, StatusCodes.NOT_FOUND, 'UserNotFound')
  }
}
