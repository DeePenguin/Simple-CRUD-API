import type { IncomingMessage, ServerResponse } from 'http'

import { getRequestBody } from '../helpers/get-request-body.helper'
import { parseRequestUrl } from '../helpers/parse-request-url.helper'
import { RequestMethods } from '../models/request-methods.enum'
import { StatusCodes } from '../models/status-codes.enum'
import { Controller } from '../utils/controller'
import { InvalidEndpointError } from '../utils/invalid-endpoint.error'
import { InvalidUserDataError } from '../utils/invalid-user-data.error'
import { UsersRepository } from './repository/users.repository'
import { UsersService } from './services/users.service'
import { validateUser } from './validators/user.validator'

interface HandlerParams {
  response: ServerResponse
  request: IncomingMessage
  id?: string
}

export class UsersController extends Controller {
  private readonly repository = new UsersRepository()
  private readonly usersService = new UsersService(this.repository)
  private readonly handlersMap: Record<string, Partial<Record<RequestMethods, (args: HandlerParams) => unknown>>> = {
    all: {
      [RequestMethods.GET]: ({ response }) => {
        this.getAllUsers(response)
      },
      [RequestMethods.POST]: async ({ response, request }) => {
        await this.createUser({ response, request })
      },
    },
    id: {},
  }

  public async handleRequest(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & {
      req: IncomingMessage
    },
  ): Promise<void> {
    try {
      const { method, url } = request
      const [, , id] = parseRequestUrl(url)
      const endpoint = id ? 'id' : 'all'

      const handler = this.handlersMap[endpoint][method as RequestMethods] ?? null

      if (!handler) {
        throw new InvalidEndpointError()
      }

      await handler({ response, request, id })
    } catch (error) {
      this.handleResponseError(response, error)
    }
  }

  private getAllUsers(response: ServerResponse): void {
    this.send(response, StatusCodes.OK, this.usersService.getAll())
  }

  private async createUser({ response, request }: HandlerParams): Promise<void> {
    const user = await getRequestBody(request)

    if (!validateUser(user)) {
      throw new InvalidUserDataError()
    }

    this.send(response, StatusCodes.CREATED, this.usersService.create(user))
  }
}
