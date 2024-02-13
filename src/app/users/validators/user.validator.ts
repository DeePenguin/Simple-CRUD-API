import type { User } from '../models/user.model'

export const validateUser = (user: unknown): user is Omit<User, 'id'> => {
  if (!user || typeof user !== 'object') {
    return false
  }

  return (
    'username' in user &&
    'age' in user &&
    'hobbies' in user &&
    typeof user.username === 'string' &&
    typeof user.age === 'number' &&
    Array.isArray(user.hobbies) &&
    user.hobbies.every(hobby => typeof hobby === 'string')
  )
}
