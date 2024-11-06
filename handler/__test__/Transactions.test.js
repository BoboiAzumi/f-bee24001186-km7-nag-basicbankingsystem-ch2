const { transactionsService } = require('../helper/TransactionsServiceInstance')
const { transfer, getAllTransactions, getTransactionsBy } = require('../Transactions')

jest.mock('../helper/TransactionsServiceInstance', () => ({
    transactionsService: {
        transfer: jest.fn(),
        getAllTransactions: jest.fn(),
        getTransactionBy: jest.fn()
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
    body: {
        data: {}
    },
    params: {
        id: 1
    }
}

const next = jest.fn()

describe('Controller Transactions.js', () => {
    describe('Transfer', () => {
        it('Should transactions success', async() => {
            req.body.data = {
                sourceBankAccountNumber: 1,
                destinationBankAccountNumber: 2,
                amount: 1000
            }

            await transfer(req, res, next)

            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                status: 'OK'
            })
        })

        it('Should transactions error', async() => {
            req.body.data = {
                sourceBankAccountNumber: 1,
                destinationBankAccountNumber: 2,
                amount: 1000
            }

            transactionsService.transfer.mockImplementation(() => {
                throw new Error()
            })

            await transfer(req, res, next)

            expect(next).toHaveBeenCalled()
        })
    })

    describe('Get all Transaction', () => {
        it('Should get all transactions', async() => {
            const log = [
                {
                    id: 6,
                    sourceAccountId: 49,
                    destinationAccountId: 50,
                    amount: 5000
                },
                {
                    id: 7,
                    sourceAccountId: 49,
                    destinationAccountId: 50,
                    amount: 5000
                }
            ]
    
            transactionsService.getAllTransactions.mockReturnValue(log)

            await getAllTransactions(req, res, next)
            expect(res.json).toHaveBeenCalledWith({
                status: 'OK',
                data: log
            })
        })

        it('Should get error', async() => {
            req.body.data = {
                sourceBankAccountNumber: 1,
                destinationBankAccountNumber: 2,
                amount: 1000
            }

            transactionsService.getAllTransactions.mockImplementation(() => {
                throw new Error()
            })

            await getAllTransactions(req, res, next)

            expect(next).toHaveBeenCalled()
        })
    })

    describe('Get all Transaction specific', () => {
        it('Should get all transactions', async() => {
            const log = [
                {
                    id: 6,
                    sourceAccountId: 49,
                    destinationAccountId: 50,
                    amount: 5000
                }
            ]
    
            transactionsService.getTransactionBy.mockReturnValue(log)

            await getTransactionsBy(req, res, next)
            expect(transactionsService.getTransactionBy).toHaveBeenCalledWith({
                id: req.params.id
            })
            expect(res.json).toHaveBeenCalledWith({
                status: 'OK',
                data: log
            })
        })

        it('Should get error', async() => {
            req.body.data = {
                sourceBankAccountNumber: 1,
                destinationBankAccountNumber: 2,
                amount: 1000
            }

            transactionsService.getTransactionBy.mockImplementation(() => {
                throw new Error()
            })

            await getTransactionsBy(req, res, next)

            expect(next).toHaveBeenCalled()
        })
    })
})