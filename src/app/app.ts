import { AppController } from './app.controller'

export class App {
  private readonly defaultPort = 4000
  private readonly port: number
  private controller = new AppController()

  constructor(port: number) {
    this.port = port || this.defaultPort
  }

  public run(): void {
    this.controller.createServer().listen(this.port, () => {
      console.log(`Server ${process.pid} is running on port ${this.port}`)
    })
  }
}
