import type { RequestListener } from 'http'

export interface Controller {
  handleRequest: RequestListener
}
