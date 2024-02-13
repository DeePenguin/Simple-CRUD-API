import { randomUUID, type UUID } from 'crypto'

import { database } from '../../db/db'
import { emitUpdateDb } from '../../helpers/emit-update-db.helper'
import { UserEntity } from '../entities/user.entity'
import type { User } from '../models/user.model'

export class UsersRepository {
  private db = database

  public getAll(): User[] {
    return Array.from(this.db.users.values())
  }

  public findOneById(id: UUID): User | null {
    return this.db.users.get(id) ?? null
  }

  public save(user: User): User {
    this.db.users.set(user.id, user)
    emitUpdateDb('users', this.db.users)

    return user
  }

  public create({ username, age, hobbies }: Omit<User, 'id'>): User {
    const id = this.generateUniqueId()
    const user = new UserEntity(id, username, age, hobbies)

    return this.save(user)
  }

  public update({ username, age, hobbies, id }: User): User | null {
    if (!this.db.users.has(id)) {
      return null
    }

    const userEntity = new UserEntity(id, username, age, hobbies)

    return this.save(userEntity)
  }

  public removeById(id: UUID): boolean {
    const isRemoved = this.db.users.delete(id)

    if (isRemoved) {
      emitUpdateDb('users', this.db.users)
    }

    return isRemoved
  }

  private generateUniqueId(): UUID {
    const uuid = randomUUID()

    return this.db.users.has(uuid) ? this.generateUniqueId() : uuid
  }
}
