const { UsersProfilesService } = require('../UsersProfiles')
const { prisma } = require('../../db/Client')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library')

jest.mock('../../db/Client', () => ({
    prisma: {
        $transaction: jest.fn(),
        user: {
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findFirst: jest.fn()
        },
        profile: {
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        }
    }
}))

jest.mock('bcrypt', () => ({
    hash: jest.fn()
}))

describe('Test UsersProfileService', () => {
    let service

    beforeEach(() => {
        service = new UsersProfilesService()
        Joi.object = jest.fn().mockReturnValue({
            validate: jest.fn().mockReturnValue({error: null})
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('Create', () => {
        it('Should create a new users', async () => {
            const user = { 
                name : 'Anto Budi', 
                email: 'Antonwibowo@gmail.com',
                password: 'antonwibowo',
                profile: {
                    identityType: 'KTP',
                    identityNumber: '0888888777666',
                    address: 'Jalan Jalan Dimana'
                }
            }

            const expected = { 
                name : 'Anto Budi', 
                email: 'Antonwibowo@gmail.com',
                password: 'InginMenjadiProgrammerHandalNamunEngganNgoding',
                profile: {
                    create: [
                        {
                            identityType: 'KTP',
                            identityNumber: '0888888777666',
                            address: 'Jalan Jalan Dimana'
                        }
                    ]
                }
            }

            bcrypt.hash.mockReturnValueOnce('InginMenjadiProgrammerHandalNamunEngganNgoding')

            await service.create(user)

            expect(prisma.user.create).toHaveBeenCalledWith({ data: expected })
        })

        it('Should be error validation', async () => {
            const user = { 
                name : 'Anto Budi', 
                email: 1,
                password: 'antonwibowo',
                profile: {
                    identityType: 'KTP',
                    identityNumber: '0888888777666',
                    address: 'Jalan Jalan Dimana'
                }
            }

            await expect(service.create(user)).rejects.toThrow()
        })

        it('Should be error transaction', async () => {
            const user = { 
                name : 'Anto Budi', 
                email: 'Antonwibowo@gmail.com',
                password: 'antonwibowo',
                profile: {
                    identityType: 'KTP',
                    identityNumber: '0888888777666',
                    address: 'Jalan Jalan Dimana'
                }
            }

            prisma.user.create.mockImplementation(() => {
                throw new Error()
            })

            await expect(service.create(user)).rejects.toThrow()
        })
    })

    describe('Find all user', () => {
        it('Should be get all user', async() => {
            const mock = [
                {
                    id: 2,
                    name: 'john doe',
                    email: 'johndoe@gmail.com',
                    password: '12345678'
                },
                {
                    id: 4,
                    name: 'john doe',
                    email: 'johndoe@gmail.com',
                    password: '12345678'
                },
                {
                    id: 7,
                    name: 'john doe',
                    email: 'johndoe@gmail.com',
                    password: '12345678'
                },
                {
                    id: 5,
                    name: 'new john doe',
                    email: 'new johndoe@gmail.com',
                    password: '12345678'
                },
            ]
            await prisma.user.findMany.mockReturnValue(mock)

            const result = await service.findAll()
            expect(result).toEqual(mock)
            expect(prisma.user.findMany).toHaveBeenCalled()
        })

        it('Should be error', async() => {
            prisma.user.findMany.mockImplementation(() => {
                throw new Error('Database Error')
            })

            await expect(service.findAll()).rejects.toThrow('Failed to fetch all data')
        })
    })

    describe('Find user by', () => {
        it('Should be get user by criteria but include is false', async() => {
            const mock = [{
                id: 1,
                name: 'Anton Wibowo',
                email: 'anton@gmail.com',
                password: '123456'
            }]
            await prisma.user.findMany.mockReturnValue(mock)

            const criteria = { id: 1 }
            const include = false

            const result = await service.findBy(criteria, include)
            expect(prisma.user.findMany).toHaveBeenCalledWith({
                include: {
                    profile: include
                },
                where: criteria
            })
            expect(result).toEqual(mock)
        })

        it('Should be get user by criteria but include is true', async() => {
            const mock = [{
                id: 4,
                name: 'john doe',
                email: 'johndoe@gmail.com',
                password: '12345678',
                profile: [
                    {
                        id: 3,
                        userId: 4,
                        identityType: 'KTP',
                        identityNumber: '1023342764323',
                        address: 'Alamat'
                    }
                ]
            }]

            await prisma.user.findMany.mockReturnValue(mock)

            const criteria = { id: 1 }
            const include = true

            const result = await service.findBy(criteria, include)
            expect(prisma.user.findMany).toHaveBeenCalledWith({
                include: {
                    profile: include
                },
                where: criteria
            })
            expect(result).toEqual(mock)
        })

        it('Should be error', async() => {
            prisma.user.findMany.mockImplementation(() => {
                throw new Error('Database Error')
            })

            const criteria = { id: 1 }
            const include = false

            await expect(service.findBy(criteria, include)).rejects.toThrow('Failed to fetch data')
        })
    })

    describe('Find user first', () => {
        it('Should be get user by criteria but include is false', async() => {
            const mock = {
                id: 1,
                name: 'Anton Wibowo',
                email: 'anton@gmail.com',
                password: '12345678'
            }
            await prisma.user.findFirst.mockReturnValue(mock)

            const criteria = { id: 1 }
            const include = false

            const result = await service.findFirst(criteria, include)
            expect(prisma.user.findFirst).toHaveBeenCalledWith({
                include: {
                    profile: include
                },
                where: criteria
            })
            expect(result).toEqual(mock)
        })

        it('Should be get user by criteria but include is true', async() => {
            const mock = {
                id: 4,
                name: 'john doe',
                email: 'johndoe@gmail.com',
                password: '12345678',
                profile: [
                    {
                        id: 3,
                        userId: 4,
                        identityType: 'KTP',
                        identityNumber: '1023342764323',
                        address: 'Alamat'
                    }
                ]
            }

            await prisma.user.findFirst.mockReturnValue(mock)

            const criteria = { id: 1 }
            const include = true

            const result = await service.findFirst(criteria, include)
            expect(prisma.user.findFirst).toHaveBeenCalledWith({
                include: {
                    profile: include
                },
                where: criteria
            })
            expect(result).toEqual(mock)
        })

        it('Should be error', async() => {
            prisma.user.findFirst.mockImplementation(() => {
                throw new Error('Database Error')
            })

            const criteria = { id: 1 }
            const include = false

            await expect(service.findFirst(criteria, include)).rejects.toThrow('Failed to fetch data')
        })
    })


    describe('Update user',  () => {
        it("Should update user's name", async () => {
            const criteria = {
                id : 1
            }

            const data = {
                name: 'Zaenal Abidin'
            }

            await service.updateUser(criteria, data)

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: criteria,
                data
            })
        })

        it("Should update user's email", async () => {
            const criteria = {
                id : 1
            }

            const data = {
                email: 'zaenalabidin@gmail.com'
            }

            await service.updateUser(criteria, data)

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: criteria,
                data
            })
        })

        it("Should update user's password", async () => {
            const criteria = {
                id : 1
            }

            const data = {
                password: 'zaenalabidin123'
            }

            bcrypt.hash.mockReturnValueOnce('zaenalabidin123')

            await service.updateUser(criteria, data)

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: criteria,
                data
            })
        })

        it('Should update all', async () => {
            const criteria = {
                id : 1
            }

            const data = {
                name: 'Zaenal Abidin',
                email: 'zaenalabidin@gmail.com',
                password: 'zaenalabidin123'
            }

            bcrypt.hash.mockReturnValueOnce('zaenalabidin123')

            await service.updateUser(criteria, data)

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: criteria,
                data
            })
        })

        it('Should throw error validation', async () => {
            const criteria = {
                id : 1
            }

            const data = {
                name: 'Zaenal Abidin',
                email: 'zaenalabidingmailcom',
                password: 'zaenalabidin123'
            }

            await expect(service.updateUser(criteria, data)).rejects.toThrow('')
        })

        it('Should throw error database', async () => {
            const criteria = {
                id : 1
            }

            const data = {
                name: 'Zaenal Abidin',
                email: 'zaenalabidin@gmail.com',
                password: 'zaenalabidin123'
            }

            prisma.user.update.mockImplementation(() => {
                throw new Error('Database Error')
            })

            await expect(service.updateUser(criteria, data)).rejects.toThrow('')
        })
    })

    describe('Update Profile', () => {
        it("Should update user's profile", async () => {
            const userId = 1
            const data = {
                identityType: 'KTP',
                identityNumber: '00001112233445',
                address: 'Jl. jalan kesana'
            }

            await service.updateProfile(userId, data)
            expect(prisma.profile.update).toHaveBeenCalledWith({
                where: {userId},
                data
            })
        })

        it('Should error validation', async () => {
            const userId = 1
            const data = {
                identityType: 3,
                identityNumber: '00001112233445',
                address: 'Jl. jalan kesana'
            }

            await expect(service.updateProfile(userId, data)).rejects.toThrow()
        })

        it('Should error database', async () => {
            const userId = 1
            const data = {
                identityType: 'KTP',
                identityNumber: '00001112233445',
                address: 'Jl. jalan kesana'
            }

            prisma.profile.update.mockImplementation(() => {
                throw new Error()
            })

            await expect(service.updateProfile(userId, data)).rejects.toThrow()
        })
    })

    describe('Delete User and Profile', () => {
        it('Should success deleted', async () => {
            const userId = 1;

            await service.deleteUserProfile(userId)

            expect(prisma.user.delete).toHaveBeenCalledWith({
                where: {
                    id: userId
                }
            })
        })

        it('Should error validation', async () => {
            const userId = 'A';

            await expect(service.deleteUserProfile(userId)).rejects.toThrow()
        })

        it('Should error not found', async () => {
            const userId = 1;

            prisma.user.delete.mockImplementation(() => {
                throw new PrismaClientKnownRequestError('Error', {code: 200, clientVersion: 'jest', meta: null, batchRequestIdx: null})
            })

            await expect(service.deleteUserProfile(userId)).rejects.toThrow('Data cannot be found')
        })
    })
})