export class APIError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly type: string = 'Error',
  ) {
    super(message)
  }
}
