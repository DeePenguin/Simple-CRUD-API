import type { UUID } from 'crypto'

import type { User } from '../models/user.model'

export class UserEntity implements User {
  constructor(
    public readonly id: UUID,
    public username: string,
    public age: number,
    public hobbies: string[],
  ) {}
}
