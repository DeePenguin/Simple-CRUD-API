/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable prefer-destructuring */

/* eslint-disable @typescript-eslint/dot-notation */
import type { Server } from 'http'
import request from 'supertest'

import { App } from './app'
import { Endpoints } from './models/endpoints.enum'
import { StatusCodes } from './models/status-codes.enum'
import type { User } from './users/models/user.model'
import { InvalidEndpointError } from './utils/invalid-endpoint.error'
import { InvalidUserDataError } from './utils/invalid-user-data.error'
import { InvalidUserIdError } from './utils/invalid-user-id.error'
import { UserNotFoundError } from './utils/user-not-found.error'

describe('App', () => {
  it('should create new app on provided port', () => {
    const app = new App(3000)
    expect(app).toBeInstanceOf(App)
    expect(app['port']).toBe(3000)
  })
})

describe('Should handle requests on invalid endpoints', () => {
  const { type, message } = new InvalidEndpointError()
  const invalidEndpointError = JSON.stringify({ error: { type, message } })
  let app: App
  let server: Server

  beforeEach(() => {
    app = new App(3000)
    app.run()
    server = app['server']
  })

  afterEach(() => {
    server.close()
  })

  it('should handle GET request on root', async () => {
    const response = await request(server).get(`/${Endpoints.ROOT}`)
    expect(response.status).toBe(StatusCodes.NOT_FOUND)
    expect(response.text).toEqual(invalidEndpointError)
  })

  it('should handle GET request on non-existent endpoint', async () => {
    const response = await request(server).get('/invalid/endpoint')
    expect(response.status).toBe(StatusCodes.NOT_FOUND)
    expect(response.text).toEqual(invalidEndpointError)
  })

  it('should handle wrong request methods on existent endpoint', async () => {
    const response = await request(server).delete(`/${Endpoints.ROOT}/users`)
    expect(response.status).toBe(StatusCodes.NOT_FOUND)
    expect(response.text).toEqual(invalidEndpointError)
  })
})

describe('Should handle requests sequence properly', () => {
  let app: App
  let server: Server
  const validUserDto = {
    username: 'test',
    age: 10,
    hobbies: ['test'],
  }
  const createdUsers: User[] = []

  beforeAll(() => {
    app = new App(3000)
    app.run()
    server = app['server']
  })

  afterAll(() => {
    server.close()
  })

  it('GET /api/users should return empty array after start', async () => {
    const response = await request(server).get(`/${Endpoints.ROOT}/${Endpoints.USERS}`)
    expect(response.status).toBe(StatusCodes.OK)
    expect(response.body?.data).toEqual([])
  })

  it('POST /api/users should return newly created user', async () => {
    const response = await request(server).post(`/${Endpoints.ROOT}/${Endpoints.USERS}`).send(validUserDto)
    const result = (JSON.parse(response.text) as { data?: User })?.data

    if (result) {
      createdUsers.push(result)
    }

    expect(response.status).toBe(StatusCodes.CREATED)
    expect(result).toEqual({ ...validUserDto, id: createdUsers[0].id })
  })

  it('GET /api/users/:id should return created user', async () => {
    const response = await request(server).get(`/${Endpoints.ROOT}/${Endpoints.USERS}/${createdUsers[0].id}`)
    const result = (JSON.parse(response.text) as { data?: User })?.data
    expect(response.status).toBe(StatusCodes.OK)
    expect(result).toEqual(createdUsers[0])
  })

  it('PUT /api/users/:id should return updated user', async () => {
    const updatedUserDto = {
      username: 'new',
      age: 50,
      hobbies: ['test', 'code'],
    }
    const response = await request(server)
      .put(`/${Endpoints.ROOT}/${Endpoints.USERS}/${createdUsers[0].id}`)
      .send(updatedUserDto)
    const result = (JSON.parse(response.text) as { data?: User })?.data

    expect(response.status).toBe(StatusCodes.OK)
    expect(result).toEqual({ ...updatedUserDto, id: createdUsers[0].id })

    createdUsers[0] = result as User
  })

  it('Delete /api/users/:id should delete user', async () => {
    const response = await request(server).delete(`/${Endpoints.ROOT}/${Endpoints.USERS}/${createdUsers[0].id}`)

    expect(response.status).toBe(StatusCodes.NO_CONTENT)
    expect(response.text).toEqual('')

    delete createdUsers[0]
  })
})

describe('Should handle requests with invalid data', () => {
  let app: App
  let server: Server
  const invalidUserDto = {
    username: 'test',
    age: '100',
    hobbies: [1, 2, 3],
  }

  beforeAll(() => {
    app = new App(3000)
    app.run()
    server = app['server']
  })

  afterAll(() => {
    server.close()
  })

  it('POST /api/users with invalid data should return bad request ', async () => {
    const { type, message } = new InvalidUserDataError()
    const invalidUserDataError = { error: { type, message } }

    const response = await request(server).post(`/${Endpoints.ROOT}/${Endpoints.USERS}`).send(invalidUserDto)

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect(JSON.parse(response.text)).toEqual(invalidUserDataError)
  })

  it('Get /api/users/:id with invalid id should return bad request ', async () => {
    const { type, message } = new InvalidUserIdError()
    const invalidUserIdError = { error: { type, message } }

    const response = await request(server).get(`/${Endpoints.ROOT}/${Endpoints.USERS}/123`)

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect(JSON.parse(response.text)).toEqual(invalidUserIdError)
  })

  it('DELETE /api/users/:id with nonexistent id should return not found', async () => {
    const { type, message } = new UserNotFoundError()
    const userNotFoundError = { error: { type, message } }

    const invalidId = 'ae613595-a584-4e5d-9af8-fc0dc97c3628'
    const response = await request(server).delete(`/${Endpoints.ROOT}/${Endpoints.USERS}/${invalidId}`)

    expect(response.status).toBe(StatusCodes.NOT_FOUND)
    expect(JSON.parse(response.text)).toEqual(userNotFoundError)
  })

  it('PUT /api/users with invalid data should return bad request ', async () => {
    const { type, message } = new InvalidUserDataError()
    const invalidUserDataError = { error: { type, message } }

    const createUserResponse = await request(server)
      .post(`/${Endpoints.ROOT}/${Endpoints.USERS}`)
      .send({
        username: 'test',
        age: 10,
        hobbies: ['test'],
      })

    const userId = (JSON.parse(createUserResponse.text) as { data: User })?.data?.id
    const response = await request(server).put(`/${Endpoints.ROOT}/${Endpoints.USERS}/${userId}`).send(invalidUserDto)

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect(JSON.parse(response.text)).toEqual(invalidUserDataError)
  })
})
