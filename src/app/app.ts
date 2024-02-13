import { AppController } from './app.controller'

export class App {
  private controller = new AppController()
  private server = this.controller.createServer()

  constructor(private readonly port: number) {}

  public run(): void {
    this.server.listen(this.port, () => {
      console.log(`Server ${process.pid} is running on port ${this.port}`)
    })
  }
}
