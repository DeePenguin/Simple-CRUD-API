import cluster from 'cluster'
import { createServer } from 'http'
import { availableParallelism } from 'os'

import { App } from './app/app'
import { database } from './app/db/db'
import type { UpdateDbMessage } from './app/helpers/emit-update-db.helper'
import { proxyRequest } from './app/helpers/proxy-request.helper'

export { database } from './app/db/db'

const PORT = Number(process.env['PORT']) || 4000
const isMulti =
  process.argv
    .slice(2)
    .find(arg => arg.startsWith('--multi'))
    ?.split('=')[1] === 'true'

if (isMulti) {
  if (cluster.isPrimary) {
    // main process
    const workersAmount = availableParallelism() - 1
    let currentWorkerIndex = 0

    const workersPool = Array.from({ length: workersAmount }, (_, i) => {
      const workerPort = PORT + i + 1
      const worker = cluster.fork({ PORT: workerPort })

      return { port: workerPort, worker }
    })

    const sendUpdateMessage = (workerPort: number, message: UpdateDbMessage): void => {
      workersPool
        .filter(({ port }) => port !== workerPort)
        .forEach(({ worker }) => {
          worker.send(message)
        })
    }

    workersPool.forEach(({ port, worker }) => {
      worker.on('message', (message: UpdateDbMessage) => {
        if (message.type === 'updateDbRecord') {
          sendUpdateMessage(port, message)
        }
      })
    })

    const proxyServer = createServer((request, response) => {
      const workerPort = workersPool[currentWorkerIndex].port
      proxyRequest(workerPort, request, response)
      console.log(`${request.method} ${request.url} redirected to ${workerPort}`)
      currentWorkerIndex = (currentWorkerIndex + 1) % workersPool.length
    })

    proxyServer.listen(PORT, () => {
      console.log(`Proxy server ${process.pid} is running on port ${PORT}`)
    })
  } else {
    // worker process
    const app = new App(PORT)
    app.run()
    process.on('message', (message: UpdateDbMessage) => {
      if (message.type === 'updateDbRecord') {
        const { dbName, dbRecords } = message.data
        database.update(dbName, dbRecords)
      }
    })
  }
} else {
  // run single app
  const app = new App(PORT)
  app.run()
}
