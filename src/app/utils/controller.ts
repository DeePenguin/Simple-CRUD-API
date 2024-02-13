import type { IncomingMessage, ServerResponse } from 'http'

import type { ControllerInterface } from '../models/controller.model'
import { ErrorMessages } from '../models/error-messages.enum'
import { StatusCodes } from '../models/status-codes.enum'
import { APIError } from './api.error'

export abstract class Controller implements ControllerInterface {
  public abstract handleRequest(request: IncomingMessage, response: ServerResponse): void

  protected send(response: ServerResponse, statusCode: number, data?: unknown): void {
    const body = data ? JSON.stringify({ data }) : undefined
    response.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'content-length': Buffer.byteLength(body ?? ''),
    })
    response.end(body)
  }

  protected sendError(response: ServerResponse, { statusCode, message, type }: APIError): void {
    const body = JSON.stringify({ error: { type, message } })
    response.writeHead(statusCode, message, {
      'Content-Type': 'application/json',
      'content-length': Buffer.byteLength(body),
    })
    response.end(body)
  }

  protected handleResponseError(response: ServerResponse, error: unknown): void {
    let safeError

    if (error instanceof APIError) {
      safeError = error
    } else {
      console.error(error)
      safeError = new APIError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR, 'InternalError')
    }

    this.sendError(response, safeError)
  }
}
