import { randomUUID, type UUID } from 'crypto'

import { UserEntity } from '../entities/user.entity'
import type { User } from '../models/user.model'

export class UsersRepository {
  private static users = new Map<UUID, User>()

  public getAll(): User[] {
    return Array.from(UsersRepository.users.values())
  }

  public findOneById(id: UUID): User | null {
    return UsersRepository.users.get(id) ?? null
  }

  public save(user: User): User {
    UsersRepository.users.set(user.id, user)

    return user
  }

  public create({ username, age, hobbies }: Omit<User, 'id'>): User {
    const id = this.generateUniqueId()
    const user = new UserEntity(id, username, age, hobbies)

    return this.save(user)
  }

  public removeById(id: UUID): boolean {
    return UsersRepository.users.delete(id)
  }

  private generateUniqueId(): UUID {
    const uuid = randomUUID()

    return UsersRepository.users.has(uuid) ? this.generateUniqueId() : uuid
  }
}
