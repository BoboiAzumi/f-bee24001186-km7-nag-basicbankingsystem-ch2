const { AccountsService } = require('../Accounts')
const { prisma } = require('../../db/Client')
const Joi = require('joi')
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library')

jest.mock('../../db/Client', () => ({
    prisma: {
        bankAccount: {
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        $transaction: jest.fn()
    }
}))

describe('Test AccountsService', () => {
    let service

    beforeEach(() => {
        service = new AccountsService()
        Joi.object = jest.fn().mockReturnValue({
            validate: jest.fn().mockReturnValue({error: null})
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('Create', () => {
        it('Should create a new account', async () => {
            const account = { userId : 1, bankName: 'Test Bank'}
            await service.create(account)

            expect(prisma.bankAccount.create).toHaveBeenCalledWith({ data: account })
        })

        it('Should error validation', async () => {
            const account = { userId : 'abcd', bankName: 'Test Bank'}

            await expect(service.create(account)).rejects.toThrow()
        })

        it('Should error database', async () => {
            const account = { userId : 1, bankName: 'Test Bank'}

            prisma.bankAccount.create.mockImplementation(() => {
                throw new Error('Error Bang')
            })

            await expect(service.create(account)).rejects.toThrow('Error Bang')
        })
    })

    describe('Find All BankAccounts', () => {
        it('Should return all BankAccounts', async () => {
            const accounts = [
                {
                    id: 4,
                    userId: 4,
                    bankName: 'bank',
                    bankAccountNumber: 4,
                    balance: 0
                },
                {
                    id: 15,
                    userId: 4,
                    bankName: 'bank anto',
                    bankAccountNumber: 15,
                    balance: 10
                }
            ]

            await prisma.bankAccount.findMany.mockReturnValue(accounts)

            const result = await service.getAllAccounts()

            expect(result).toEqual(accounts)
        })

        it('Should throw error', async () => {
            prisma.bankAccount.findMany.mockImplementation(() => {
                throw new Error('Error Bang')
            })

            await expect(service.getAllAccounts()).rejects.toThrow('Error Bang')
        })
    })

    describe('Find BankAccount by id', () => {
        afterEach(() => {
            jest.clearAllMocks()
        })
        it('Should return bank accounts by id', async () => {
            const accounts = [
                {
                    id: 4,
                    userId: 4,
                    bankName: 'bank',
                    bankAccountNumber: 4,
                    balance: 0
                }
            ]

            const criteria = { id: 4 }
            const includeUsers = false

            await prisma.bankAccount.findMany.mockReturnValue(accounts)

            const result = await service.getAccountBy(criteria)

            expect(result).toEqual(accounts)
            expect(prisma.bankAccount.findMany).toHaveBeenCalledWith({
                where: criteria,
                include: {
                    user: includeUsers
                }
            })
        })

        it('Should throw error', async () => {
            prisma.bankAccount.findMany.mockImplementation(() => {
                throw new Error('Error Bang')
            })

            await expect(service.getAccountBy()).rejects.toThrow('Error Bang')
            prisma.bankAccount.findMany.mockReset()
        })
    })

    describe('Update BankAccounts', () => {
        it('Should update BankAccounts', async() => {
            const criteria = { id : 1, userId : 1}
            const data = {
                bankName: 'bank',
            }

            await service.updateAccount(criteria, data)

            expect(prisma.bankAccount.update).toHaveBeenCalledWith({
                where: criteria,
                data
            })
        })

        it('Should error validation', async() => {
            const criteria = { id : 1, userId : 1}
            const data = {
                bankName: 3,
            }

            await expect(service.updateAccount(criteria, data)).rejects.toThrow()
        })

        it('Should error database', async() => {
            const criteria = { id : 1, userId : 1}
            const data = {
                bankName: 'Bank',
            }

            prisma.bankAccount.update.mockImplementation(() => {
                throw new Error('Error Bang')
            })

            await expect(service.updateAccount(criteria, data)).rejects.toThrow('Error Bang')
            prisma.bankAccount.update.mockReset()
        })
    })

    describe('Delete bankAccount', () => {
        afterEach(() => {
            jest.clearAllMocks()
        })

        it('Should delete bankAccount', async() => {
            const accountId = 1
            const userId = 1

            await service.deleteBankAccount(accountId, userId)
        
            expect(prisma.bankAccount.delete).toHaveBeenCalledWith({
                where: { id: accountId, userId }
            })
        })

        it('Should error validation', async() => {
            const accountId = ''

            await expect(service.deleteBankAccount(accountId)).rejects.toThrow()
        })

        it('Should error no bankAccount', async() => {
            const accountId = 1
            const userId = 1

            prisma.bankAccount.delete.mockImplementation(() => {
                throw new PrismaClientKnownRequestError('Error', { code: 20, clientVersion: '0', meta: null, batchRequestIdx: null })
            })

            await expect(service.deleteBankAccount(accountId, userId)).rejects.toThrow()
        })

        it('Should error database', async() => {
            const accountId = 1
            const userId = 1

            prisma.bankAccount.delete.mockImplementation(() => {
                throw new Error('Error Bang')
            })

            await expect(service.deleteBankAccount(accountId, userId)).rejects.toThrow('Error Bang')
        })
    })

    describe('Deposit', () => {
        it('Should success deposit', async () => {
            const id = 1
            const amount = 500
            const userId = 1
            const value = [
                {
                    id: 1,
                    userId: 1,
                    bankName: 'bank',
                    bankAccountNumber: 1,
                    balance: 0
                }
            ]

            await prisma.bankAccount.findMany.mockReturnValue(value)
            await service.deposit(id, amount, userId)

            expect(prisma.bankAccount.findMany).toHaveBeenCalledWith({
                where: {id, userId}
            })

            expect(prisma.bankAccount.update).toHaveBeenCalledWith({
                where: {id, userId},
                data: {
                    balance: amount + value[0].balance
                }
            })
        })

        it('Should error account not found', async () => {
            const id = 1
            const amount = 500
            const userId = 1
            const value = []

            await prisma.bankAccount.findMany.mockReturnValue(value)

            await expect(service.deposit(id, amount, userId)).rejects.toThrow('Account not found')
        })

        it('Should error validation', async () => {
            const id = null
            const amount = '500'
            const userId = 1

            await expect(service.deposit(id, amount, userId)).rejects.toThrow()
        })

        it('Should error database', async () => {
            const id = 1
            const amount = 500
            const userId = 1
            const value = [
                {
                    id: 1,
                    userId: 1,
                    bankName: 'bank',
                    bankAccountNumber: 1,
                    balance: 0
                }
            ]

            await prisma.bankAccount.findMany.mockReturnValue(value)

            await prisma.bankAccount.update.mockImplementation(() => {
                throw new Error('Error Bang')
            })
            
            await expect(service.deposit(id, amount, userId)).rejects.toThrow('Error Bang')

            prisma.bankAccount.update.mockReset()
        })

        it('Should error database', async () => {
            const id = 1
            const amount = 500
            const userId = 1

            await prisma.bankAccount.findMany.mockImplementation(() => {
                throw new Error('Error Bang')
            })
            
            await expect(service.deposit(id, amount, userId)).rejects.toThrow('Error Bang')

            prisma.bankAccount.findMany.mockReset()
        })
    })

    describe('Withdraw', () => {
        it('Should success deposit', async () => {
            const id = 1
            const amount = 500
            const userId = 1
            const value = [
                {
                    id: 1,
                    userId: 1,
                    bankName: 'bank',
                    bankAccountNumber: 1,
                    balance: 1000
                }
            ]

            await prisma.bankAccount.findMany.mockReturnValue(value)
            await service.withdraw(id, amount, userId)

            expect(prisma.bankAccount.findMany).toHaveBeenCalledWith({
                where: {id, userId}
            })

            expect(prisma.bankAccount.update).toHaveBeenCalledWith({
                where: {id, userId},
                data: {
                    balance: value[0].balance - amount
                }
            })
        })

        it('Should error account not found', async () => {
            const id = 1
            const amount = 1000
            const userId = 1
            const value = []

            await prisma.bankAccount.findMany.mockReturnValue(value)

            await expect(service.withdraw(id, amount, userId)).rejects.toThrow('Account not found')
        })

        it('Should error validation', async () => {
            const id = null
            const amount = '500'
            const userId = 1

            await expect(service.withdraw(id, amount, userId)).rejects.toThrow()
        })

        it('Should error database', async () => {
            const id = 1
            const amount = 500
            const userId = 1
            const value = [
                {
                    id: 1,
                    userId: 1,
                    bankName: 'bank',
                    bankAccountNumber: 1,
                    balance: 1000
                }
            ]

            await prisma.bankAccount.findMany.mockReturnValue(value)

            await prisma.bankAccount.update.mockImplementation(() => {
                throw new Error('Error Bang')
            })
            
            await expect(service.withdraw(id, amount, userId)).rejects.toThrow('Error Bang')

            prisma.bankAccount.update.mockReset()
        })

        it('Should error database', async () => {
            const id = 1
            const amount = 500
            const userId = 1

            await prisma.bankAccount.findMany.mockImplementation(() => {
                throw new Error('Error Bang')
            })
            
            await expect(service.withdraw(id, amount, userId)).rejects.toThrow('Error Bang')

            prisma.bankAccount.findMany.mockReset()
        })
    })
})