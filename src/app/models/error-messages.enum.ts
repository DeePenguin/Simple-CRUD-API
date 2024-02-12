export const enum ErrorMessages {
  INVALID_ENDPOINT = "You don't have access to this endpoint",
  INTERNAL_SERVER_ERROR = 'Something went wrong, please try again later',
  USER_NOT_FOUND = 'User not found',
  INVALID_USER_DATA = 'Request body must be in the following format: { username: string, age: number, hobbies: string[] }',
  INVALID_USER_ID = 'Invalid user id. Id must be a valid uuid',
}
