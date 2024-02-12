/* eslint-disable @typescript-eslint/dot-notation */
import type { UUID } from 'crypto'

import { UsersRepository } from './users.repository'

describe('UsersRepository', () => {
  const invalidId: UUID = 'ae613595-a584-4e5d-9af8-fc0dc97c3628'
  let usersRepository: UsersRepository

  beforeEach(() => {
    usersRepository = new UsersRepository()
    usersRepository['db'].update('users', {})
  })

  it('should create a new user and save it to the database', () => {
    const userData = {
      username: 'user1',
      age: 20,
      hobbies: ['hobby1'],
    }

    const result = usersRepository.create(userData)

    expect(result.username).toEqual(userData.username)
    expect(result.age).toEqual(userData.age)
    expect(result.hobbies).toEqual(userData.hobbies)
    expect(usersRepository.findOneById(result.id)).toEqual(result)
  })

  it('should return null when findOneById is called with a non-existent id', () => {
    const result = usersRepository.findOneById(invalidId)

    expect(result).toBeNull()
  })

  it('should return null when update is called with a non-existent user', () => {
    const user = {
      id: invalidId,
      username: 'user1',
      age: 20,
      hobbies: ['hobby1'],
    }

    const result = usersRepository.update(user)

    expect(result).toBeNull()
  })

  it('should return updated user when update is called with existent user', () => {
    const user = usersRepository.create({
      username: 'user1',
      age: 20,
      hobbies: ['hobby1'],
    })

    const updateDto = {
      username: 'user2',
      age: 21,
      hobbies: ['hobby2'],
    }

    const result = usersRepository.update({ ...updateDto, id: user.id })

    expect(result?.username).toEqual(updateDto.username)
    expect(result?.age).toEqual(updateDto.age)
    expect(result?.hobbies).toEqual(updateDto.hobbies)
    expect(result?.id).toEqual(user.id)
  })

  it('should remove user by id and return true if the user exists', () => {
    const user = usersRepository.create({
      username: 'user1',
      age: 20,
      hobbies: ['hobby1'],
    })

    const result = usersRepository.removeById(user.id)

    expect(result).toBe(true)
    expect(usersRepository.findOneById(user.id)).toBeNull()
  })

  it('should return false if removeById is called with a non-existent id', () => {
    const user = usersRepository.create({
      username: 'user1',
      age: 20,
      hobbies: ['hobby1'],
    })

    expect(usersRepository.removeById(user.id)).toBe(true)
    expect(usersRepository.removeById(user.id)).toBe(false)
  })
})
