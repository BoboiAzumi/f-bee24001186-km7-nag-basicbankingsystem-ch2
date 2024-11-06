const { PrismaClientValidationError } = require('@prisma/client/runtime/library')
const { usersProfilesService } = require('../helper/UsersProfilesServiceInstance')
const { getAllUsers, getUserById, newUser, updateUser, updateProfile, deleteUserProfile } = require('../UsersProfiles')

jest.mock('../helper/UsersProfilesServiceInstance', () => ({
    usersProfilesService: {
        create: jest.fn(),
        findBy: jest.fn(),
        findAll: jest.fn(),
        findFirst: jest.fn(),
        updateUser: jest.fn(),
        updateProfile: jest.fn(),
        deleteUserProfile: jest.fn()
    }
}))

const res = {
    json: jest.fn(),
    status: jest.fn()
}

const req = {
    user: {
        id: 1
    },
    body: {},
    params: {
        id: 1
    }
}

const next = jest.fn()

describe('Controller UsersProfiles.js', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('Get All Users Profile', () => {
        it('Should get all users', async() => {
            await getAllUsers(req, res, next)

            expect(usersProfilesService.findAll).toHaveBeenCalled()
            expect(res.json).toHaveBeenCalled()
        })

        it('Should throw error to middleware', async() => {
            usersProfilesService.findAll.mockImplementation(() => {
                throw new Error()
            })
            await getAllUsers(req, res, next)

            expect(next).toHaveBeenCalled()
        })
    })

    describe('Get user by id', () => {
        it('Should get user by id', async() => {
            const userProfiles = [
                {
                    id: 1,
                    name: 'Zaenal Abidin',
                    email: 'nadiakomalasari@gmail.com',
                    password: '$2b$04$9o0rDYDbVrrzpnXBupjf6e2D/KIDWC.7m7qrbMTzyEQ3jV8firisW'
                }
            ]

            usersProfilesService.findBy.mockReturnValue(userProfiles)

            await getUserById(req, res, next)

            expect(usersProfilesService.findBy).toHaveBeenCalledWith({
                id: req.params.id
            }, true)
            expect(res.json).toHaveBeenCalled()
        })

        it('Should get user by id but not found', async() => {
            const userProfiles = []

            usersProfilesService.findBy.mockReturnValue(userProfiles)

            await getUserById(req, res, next)

            expect(usersProfilesService.findBy).toHaveBeenCalledWith({
                id: req.params.id
            }, true)
            expect(res.json).toHaveBeenCalledWith({
                status: 'OK',
                data: {}
            })
        })

        it('Should throw error to middleware', async() => {
            usersProfilesService.findBy.mockImplementation(() => {
                throw new Error()
            })
            await getUserById(req, res, next)

            expect(next).toHaveBeenCalled()
        })
    })

    describe('Create new user', () => {
        it('Should create new user', async() => {
            req.body.data = {
                name: 'Zaenal Abidin',
                email: 'nadiakomalasari@gmail.com',
                password: '$2b$04$9o0rDYDbVrrzpnXBupjf6e2D/KIDWC.7m7qrbMTzyEQ3jV8firisW',
                profile: {
                    identityType: 'KTP',
                    identityNumber: '1023342764323',
                    address: 'Alamat'
                }
            }

            usersProfilesService.create.mockReturnValue()

            await newUser(req, res, next)

            expect(usersProfilesService.create).toHaveBeenCalledWith(req.body.data)
            expect(res.json).toHaveBeenCalled()
        })

        it('Should throw error to middleware PrismaClientValidationError', async() => {
            usersProfilesService.create.mockImplementation(() => {
                throw new PrismaClientValidationError('Error wak', { clientVersion: '1.1' })
            })
            await newUser(req, res, next)

            expect(next).toHaveBeenCalled()
        })

        it('Should throw error to middleware', async() => {
            usersProfilesService.create.mockImplementation(() => {
                throw new Error()
            })
            await newUser(req, res, next)

            expect(next).toHaveBeenCalled()
        })
    })

    describe('Update user', () => {
        it('Should update user', async() => {
            req.body.data = {
                name: 'Zaenal Abidin',
                email: 'nadiakomalasari@gmail.com',
                password: '12345678'
            }
    
            await updateUser(req, res, next)

            expect(usersProfilesService.updateUser).toHaveBeenCalledWith({
                id: req.params.id,
            }, req.body.data)

            expect(res.json).toHaveBeenCalledWith({
                status: 'SUCCESS'
            })
        })

        it('Should update user', async() => {
            usersProfilesService.updateUser.mockImplementation(() => {
                throw new Error()
            })
    
            await updateUser(req, res, next)


            expect(next).toHaveBeenCalled()
        })
    })

    describe('Update profile', () => {
        it('Should update profile', async() => {
            req.body.data = {
                identityType: 'KTP',
                identityNumber: '1023342764323',
                address: 'Alamat'
            }
    
            await updateProfile(req, res, next)

            expect(usersProfilesService.updateProfile).toHaveBeenCalledWith(req.params.id, req.body.data)

            expect(res.json).toHaveBeenCalledWith({
                status: 'SUCCESS'
            })
        })

        it('Should update profile', async() => {
            usersProfilesService.updateProfile.mockImplementation(() => {
                throw new Error()
            })
            await updateProfile(req, res, next)

            expect(next).toHaveBeenCalled()
        })
    })

    describe('Delete profile', () => {
        it('Should delete profile', async() => {
            await deleteUserProfile(req, res, next)

            expect(usersProfilesService.deleteUserProfile).toHaveBeenCalledWith(req.params.id)

            expect(res.json).toHaveBeenCalledWith({
                status: 'SUCCESS'
            })
        })

        it('Should update profile', async() => {
            usersProfilesService.deleteUserProfile.mockImplementation(() => {
                throw new Error()
            })
            await deleteUserProfile(req, res, next)

            expect(next).toHaveBeenCalled()
        })
    })
})