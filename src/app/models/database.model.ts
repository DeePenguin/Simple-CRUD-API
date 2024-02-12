import type { UUID } from 'crypto'

import type { User } from '../users/models/user.model'

export interface Database {
  users: Map<UUID, User>
  update: <T extends Exclude<keyof Database, 'update'>, K extends keyof Database[T]>(
    key: T,
    state: Record<K, Database[T][K]>,
  ) => void
}
