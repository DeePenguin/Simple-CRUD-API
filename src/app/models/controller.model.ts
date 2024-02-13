import type { RequestListener } from 'http'

export interface ControllerInterface {
  handleRequest: RequestListener
}
