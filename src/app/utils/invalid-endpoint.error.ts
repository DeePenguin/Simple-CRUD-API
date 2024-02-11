import { ErrorMessages } from '../models/error-messages.enum'
import { StatusCodes } from '../models/status-codes.enum'
import { APIError } from './api.error'

export class InvalidEndpointError extends APIError {
  constructor() {
    super(ErrorMessages.INVALID_ENDPOINT, StatusCodes.NOT_FOUND)
  }
}
