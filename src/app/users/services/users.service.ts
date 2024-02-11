import type { User } from '../models/user.model'
import type { UsersRepository } from '../repository/users.repository'
import { validateUser } from '../validators/user.validator'

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  public create(user: Omit<User, 'id'>): User {
    if (!validateUser(user)) {
      throw new Error('Invalid user')
    }

    return this.usersRepository.create(user)
  }

  public getAll(): User[] {
    return this.usersRepository.getAll()
  }
}
