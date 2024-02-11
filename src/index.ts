import { App } from './app/app'

const port = Number(process.env['PORT'])

const app = new App(port)
app.run()
