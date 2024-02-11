import type { IncomingMessage, ServerResponse } from 'http'

import type { Controller } from './models/controller.model'
import { UsersRepository } from './repository/users.repository'
import { UsersService } from './services/users.service'

export class UsersController implements Controller {
  private readonly repository = new UsersRepository()
  private readonly usersService = new UsersService(this.repository)

  public handleRequest(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & {
      req: IncomingMessage
    },
  ): void {
    console.log('users', request, response)

    return
  }
}
