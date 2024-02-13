import type { IncomingMessage } from 'http'

export const getRequestBody = (request: IncomingMessage): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const body: Buffer[] = []
    request.on('data', (chunk: Buffer) => body.push(chunk))
    request.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(body).toString()))
      } catch (error) {
        reject(error)
      }
    })
    request.on('error', reject)
  })
}
