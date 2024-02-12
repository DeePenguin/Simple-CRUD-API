import type { UUID } from 'crypto'

import type { Database } from '../models/database.model'
import type { User } from '../users/models/user.model'

export const database: Database = {
  users: new Map<UUID, User>(),
  update: <T extends Exclude<keyof Database, 'update'>, K extends keyof Database[T]>(
    key: T,
    state: Record<K, Database[T][K]>,
  ) => {
    const entries = Object.entries<Database[T][K]>(state) as Array<[K, Database[T][K]]>
    const mapFromRecord = new Map(entries) as Database[T]
    database[key] = mapFromRecord
  },
}
