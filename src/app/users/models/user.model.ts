import type { UUID } from 'crypto'

export interface User {
  id: UUID
  username: string
  age: number
  hobbies: string[]
}
