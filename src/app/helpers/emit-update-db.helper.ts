import cluster from 'cluster'

import type { Database } from '../models/database.model'

export interface UpdateDbMessage {
  type: 'updateDbRecord'
  data: {
    dbName: Exclude<keyof Database, 'update'>
    dbRecords: Database[Exclude<keyof Database, 'update'>]
  }
}

export const emitUpdateDb = <T extends Exclude<keyof Database, 'update'>>(dbName: T, dbRecords: Database[T]): void => {
  if (cluster.isWorker) {
    const convertedRecords = Object.fromEntries(dbRecords)
    process.send?.({ type: 'updateDbRecord', data: { dbName, dbRecords: convertedRecords } })
  }
}
