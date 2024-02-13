import { ErrorMessages } from '../models/error-messages.enum'
import { StatusCodes } from '../models/status-codes.enum'
import { APIError } from './api.error'

export class InvalidUserIdError extends APIError {
  constructor() {
    super(ErrorMessages.INVALID_USER_ID, StatusCodes.BAD_REQUEST, 'InvalidUserId')
  }
}
