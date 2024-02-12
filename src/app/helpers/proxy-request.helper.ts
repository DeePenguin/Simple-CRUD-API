import { request as httpRequest, type IncomingMessage, type ServerResponse } from 'http'

export const proxyRequest = (port: number, request: IncomingMessage, response: ServerResponse): void => {
  const proxy = httpRequest(
    {
      port,
      path: request.url,
      method: request.method,
      headers: request.headers,
    },
    proxyResponse => {
      response.writeHead(proxyResponse.statusCode as number, proxyResponse.headers)
      proxyResponse.pipe(response, { end: true })
    },
  )

  request.pipe(proxy, { end: true })
}
