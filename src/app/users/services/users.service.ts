import type { UUID } from 'crypto'

import type { User } from '../models/user.model'
import type { UsersRepository } from '../repository/users.repository'

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  public create(user: Omit<User, 'id'>): User {
    return this.usersRepository.create(user)
  }

  public getAll(): User[] {
    return this.usersRepository.getAll()
  }

  public findOneById(id: UUID): User | null {
    return this.usersRepository.findOneById(id)
  }

  public updateById(id: UUID, user: Omit<User, 'id'>): User | null {
    return this.usersRepository.update({ ...user, id })
  }
}
