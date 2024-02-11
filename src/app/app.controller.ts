import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'http'

import { endpointsMap } from './helpers/endpoints-map.helper'
import { parseRequestUrl } from './helpers/parse-request-url.helper'
import { Endpoints } from './models/endpoints.enum'
import { ErrorMessages } from './models/error-messages.enum'
import { StatusCodes } from './models/status-codes.enum'
import type { Controller } from './users/models/controller.model'
import { APIError } from './utils/api.error'
import { InvalidEndpointError } from './utils/invalid-endpoint.error'

export class AppController implements Controller {
  private controllers: Map<string, Controller>
  private pathSegment = Endpoints.ROOT

  constructor() {
    this.controllers = new Map()
    Object.entries(endpointsMap).forEach(([key, value]) => {
      this.controllers.set(key, value)
    })
  }

  public createServer(): Server {
    return createServer((request, response) => {
      this.handleRequest(request, response)
    })
  }

  public handleRequest(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & {
      req: IncomingMessage
    },
  ): void {
    try {
      const controller = this.findController(request.url as string)

      if (!controller) {
        throw new InvalidEndpointError()
      }

      controller.handleRequest(request, response)
    } catch (error) {
      this.handleResponseError(response, error)
    }
  }

  private sendError(response: ServerResponse, { statusCode, message, body }: APIError): void {
    response.writeHead(statusCode, message)
    response.end(body ? JSON.stringify(body) : undefined)
  }

  private handleResponseError(response: ServerResponse, error: unknown): void {
    let safeError

    if (error instanceof APIError) {
      safeError = error
    } else {
      safeError = new APIError(ErrorMessages.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR)
    }

    this.sendError(response, safeError)
  }

  private findController(url: string): Controller | null {
    const parsedUrl = parseRequestUrl(url)
    const [base, nextSegment] = parsedUrl

    if (base !== (this.pathSegment as string)) {
      return null
    }

    return this.controllers.get(nextSegment) ?? null
  }
}
