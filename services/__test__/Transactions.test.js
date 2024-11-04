const { TransactionsService } = require('../Transactions')
const { prisma } = require('../../db/Client')

jest.mock('../../db/Client', () => ({
    prisma: {
        bankAccount: {
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        transaction: {
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        $transaction: jest.fn()
    }
}))

describe('Transaction Test', () => {
    let service

    beforeEach(() => {
        service = new TransactionsService()
    })
    
    describe('Transfer', () => {
        it('Should success Transfer', async () => {
            const data = {
                sourceBankAccountNumber: 1,
                destinationBankAccountNumber: 2,
                amount: 2000
            }

            const source = {
                id: 1,
                userId: 4,
                bankName: 'bank',
                bankAccountNumber: 1,
                balance: 10000
            }

            const destination = {
                id: 2,
                userId: 2,
                bankName: 'bank',
                bankAccountNumber: 2,
                balance: 0
            }

            prisma.bankAccount.findMany.mockReturnValueOnce([source])

            prisma.bankAccount.findMany.mockReturnValueOnce([destination])

            await service.transfer(data)

            expect(prisma.bankAccount.findMany).toHaveBeenNthCalledWith(1, {
                where: {
                    bankAccountNumber: data.sourceBankAccountNumber
                }
            })

            expect(prisma.bankAccount.findMany).toHaveBeenNthCalledWith(2, {
                where: {
                    bankAccountNumber: data.destinationBankAccountNumber
                }
            })

            expect(prisma.transaction.create).toHaveBeenCalledWith({
                data: {
                    sourceAccountId: data.sourceBankAccountNumber,
                    destinationAccountId: data.destinationBankAccountNumber,
                    amount: data.amount
                }
            })

            expect(prisma.bankAccount.update).toHaveBeenNthCalledWith(1, {
                where: {
                    id: source.id
                },
                data: {
                    balance: source.balance - data.amount
                }
            })

            expect(prisma.bankAccount.update).toHaveBeenNthCalledWith(2, {
                where: {
                    id: destination.id
                },
                data: {
                    balance: destination.balance + data.amount
                }
            })
        })

        it('Should error validation', async () => {
            const data = {
                sourceBankAccountNumber: 'abcd',
                destinationBankAccountNumber: 2,
                amount: 2000
            }

            await expect(service.transfer(data)).rejects.toThrow()
        })

        it('Should error "Source bank account number or destination bank account number invalid"', async () => {
            const data = {
                sourceBankAccountNumber: 1,
                destinationBankAccountNumber: 2,
                amount: 2000
            }

            prisma.bankAccount.findMany.mockReturnValueOnce([])

            prisma.bankAccount.findMany.mockReturnValueOnce([])

            await expect(service.transfer(data)).rejects.toThrow('Source bank account number or destination bank account number invalid')
        })

        it('Should error Insufficient Balance', async () => {
            const data = {
                sourceBankAccountNumber: 1,
                destinationBankAccountNumber: 2,
                amount: 2000
            }

            const source = {
                id: 1,
                userId: 4,
                bankName: 'bank',
                bankAccountNumber: 1,
                balance: 0
            }

            const destination = {
                id: 2,
                userId: 2,
                bankName: 'bank',
                bankAccountNumber: 2,
                balance: 0
            }

            prisma.bankAccount.findMany.mockReturnValueOnce([source])

            prisma.bankAccount.findMany.mockReturnValueOnce([destination])

            await expect(service.transfer(data)).rejects.toThrow('Insufficient balance')
        })

        it('Should error same destination', async () => {
            const data = {
                sourceBankAccountNumber: 1,
                destinationBankAccountNumber: 1,
                amount: 1000
            }

            const source = {
                id: 1,
                userId: 4,
                bankName: 'bank',
                bankAccountNumber: 1,
                balance: 2000
            }

            const destination = {
                id: 1,
                userId: 4,
                bankName: 'bank',
                bankAccountNumber: 1,
                balance: 0
            }

            prisma.bankAccount.findMany.mockReturnValueOnce([source])

            prisma.bankAccount.findMany.mockReturnValueOnce([destination])

            await expect(service.transfer(data)).rejects.toThrow('Unable to make transfer to the same account')
        })
    })

    describe('Get All Transaction', () => {
        it('Should return all transaction', async () => {
            const transactions = [
                {
                    id: 1,
                    sourceAccountId: 2,
                    destinationAccountId: 14,
                    amount: 3000
                },
                {
                    id: 2,
                    sourceAccountId: 2,
                    destinationAccountId: 14,
                    amount: 3000
                }
            ]

            prisma.transaction.findMany.mockReturnValue(transactions)
            const result = await service.getAllTransactions()

            expect(result).toEqual(transactions)
        })

        it('Should return all transaction', async () => {
            prisma.transaction.findMany.mockImplementation(() => {
                throw new Error('Error bang')
            })
            await expect(service.getAllTransactions()).rejects.toThrow()
        })
    })

    describe('Get Transaction By', () => {
        it('Should return all transaction by', async () => {
            const criteria = {
                id: 1
            }
            const transactions = [
                {
                    id: 1,
                    sourceAccountId: 2,
                    destinationAccountId: 14,
                    amount: 3000,
                    source: {
                        id: 2,
                        userId: 2,
                        bankName: 'bank',
                        bankAccountNumber: 2,
                        balance: 995000
                    },
                    destination: {
                        id: 14,
                        userId: 4,
                        bankName: 'Inazuma Bank',
                        bankAccountNumber: 14,
                        balance: 2000
                    }
                }
            ]

            prisma.transaction.findMany.mockReturnValue(transactions)
            const result = await service.getTransactionBy(criteria)

            expect(result).toEqual(transactions)
        })

        it('Should return all transaction', async () => {
            const criteria = {
                id: 1
            }
            prisma.transaction.findMany.mockImplementation(() => {
                throw new Error('Error bang')
            })
            await expect(service.getTransactionBy(criteria)).rejects.toThrow()
        })
    })
})