import { ErrorMessages } from '../models/error-messages.enum'
import { StatusCodes } from '../models/status-codes.enum'
import { APIError } from './api.error'

export class InvalidUserDataError extends APIError {
  constructor() {
    super(ErrorMessages.INVALID_USER_DATA, StatusCodes.BAD_REQUEST, 'InvalidUserData')
  }
}
