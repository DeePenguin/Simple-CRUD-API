import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'http'

import { endpointsMap } from './helpers/endpoints-map.helper'
import { parseRequestUrl } from './helpers/parse-request-url.helper'
import { Endpoints } from './models/endpoints.enum'
import { Controller } from './utils/controller'
import { InvalidEndpointError } from './utils/invalid-endpoint.error'

export class AppController extends Controller {
  private controllers: Map<string, Controller>
  private pathSegment = Endpoints.ROOT

  constructor() {
    super()
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

  private findController(url: string): Controller | null {
    const parsedUrl = parseRequestUrl(url)
    const [base, nextSegment] = parsedUrl

    if (base !== (this.pathSegment as string)) {
      return null
    }

    return this.controllers.get(nextSegment) ?? null
  }
}
