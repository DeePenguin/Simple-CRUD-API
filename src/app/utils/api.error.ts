export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public body?: string,
  ) {
    super(message)
  }
}
