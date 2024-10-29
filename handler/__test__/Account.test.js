const { createAccount, getAllAccounts, getAccountById, updateAccount, deleteAccount, deposit, withdraw } = require("../Accounts")
const { accountsService } = require("../helper/AccountServiceInstance")
const { usersProfilesService } = require("../helper/UsersProfilesServiceInstance")

jest.mock("../helper/AccountServiceInstance", () => ({
    accountsService: {
        create: jest.fn(),
        getAllAccounts: jest.fn(),
        getAccountBy: jest.fn(),
        updateAccount: jest.fn(),
        deleteBankAccount: jest.fn(),
        deposit: jest.fn(),
        withdraw: jest.fn()
    }
}))
jest.mock("../helper/UsersProfilesServiceInstance", () => ({
    usersProfilesService: {
        create: jest.fn(),
        findBy: jest.fn()
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
        data: {
            bankName: "BankIndonesia",
            amount: 500
        }
    },
    params: {
        id: 1
    }
}

const next = jest.fn()

describe("Controller Account.js", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe("Create Account", () => {
        it("Should success create account", async() => {
            const userProfiles = [
                {
                    id: 1,
                    name: "Zaenal Abidin",
                    email: "nadiakomalasari@gmail.com",
                    password: "$2b$04$9o0rDYDbVrrzpnXBupjf6e2D/KIDWC.7m7qrbMTzyEQ3jV8firisW"
                }
            ]

            usersProfilesService.findBy.mockReturnValue(userProfiles)
            accountsService.create.mockReturnValue()

            await createAccount(req, res, next)

            expect(usersProfilesService.findBy).toHaveBeenCalledWith({
                id: req.user.id
            })

            expect(accountsService.create).toHaveBeenCalledWith({
                userId: req.user.id,
                bankName: req.body.data.bankName
            })

            expect(res.status).toHaveBeenCalled()
            expect(res.json).toHaveBeenCalled()
        })

        it("Should error users not found", async() => {
            let req = {
                user: {
                    id: 1
                },
                body: {
                    data: {
                        bankName: "BankIndonesia"
                    }
                }
            }

            const userProfiles = []

            usersProfilesService.findBy.mockReturnValue(userProfiles)

            await createAccount(req, res, next)

            expect(next).toHaveBeenCalled()
        })
    })

    describe("Get all accounts", () => {
        it("Should return all accounts", async () => {
            const bankAccounts = [
                {
                    id: 49,
                    userId: 39,
                    bankName: "BANK ASIA",
                    bankAccountNumber: 49,
                    balance: 5000
                },
                {
                    id: 50,
                    userId: 39,
                    bankName: "BANK INDONESIA",
                    bankAccountNumber: 50,
                    balance: 15000
                },
            ]

            accountsService.getAccountBy.mockReturnValue(bankAccounts)

            await getAllAccounts(req, res, next)

            expect(res.json).toHaveBeenCalledWith({
                status: "OK",
                data: bankAccounts
            })
        })

        it("Should throw error to middleware error handling", async () => {
            accountsService.getAccountBy.mockImplementation(() => {
                throw new Error()
            })

            await getAllAccounts(req, res, next)

            expect(next).toHaveBeenCalled()
        })
    })

    describe("Get accounts by id", () => {
        it("Should return all accounts", async () => {
            const bankAccounts = [
                {
                    id: 1,
                    userId: 39,
                    bankName: "BANK ASIA",
                    bankAccountNumber: 49,
                    balance: 5000
                }
            ]

            accountsService.getAccountBy.mockReturnValue(bankAccounts)

            await getAccountById(req, res, next)

            expect(res.json).toHaveBeenCalledWith({
                status: "OK",
                data: bankAccounts[0]
            })
        })

        it("Should return {} if account not found", async () => {
            const bankAccounts = []

            accountsService.getAccountBy.mockReturnValue(bankAccounts)

            await getAccountById(req, res, next)

            expect(res.json).toHaveBeenCalledWith({
                status: "OK",
                data: {}
            })
        })

        it("Should throw error to middleware error handling", async () => {
            accountsService.getAccountBy.mockImplementation(() => {
                throw new Error()
            })

            await getAccountById(req, res, next)

            expect(next).toHaveBeenCalled()
        })
    })

    describe("Update account", () => {
        it("Should update account", async () => {
            await updateAccount(req, res, next)

            expect(res.json).toHaveBeenCalled()
        })
        it("Should update error", async () => {
            accountsService.updateAccount.mockImplementation(() => {
                throw new Error()
            })

            await updateAccount(req, res, next)

            expect(next).toHaveBeenCalled()
        })
    })

    describe("Delete account", () => {
        it("Should delete account", async () => {
            await deleteAccount(req, res, next)

            expect(res.json).toHaveBeenCalled()
        })

        it("Should update error", async () => {
            accountsService.deleteBankAccount.mockImplementation(() => {
                throw new Error()
            })

            await deleteAccount(req, res, next)

            expect(next).toHaveBeenCalled()
        })
    })

    describe("Deposit", () => {
        it("Should deposit", async () => {
            await deposit(req, res, next)

            expect(res.json).toHaveBeenCalled()
        })

        it("Should deposit error", async () => {
            accountsService.deposit.mockImplementation(() => {
                throw new Error()
            })

            await deposit(req, res, next)

            expect(next).toHaveBeenCalled()
        })
    })

    describe("Withdraw", () => {
        it("Should withdraw", async () => {
            await withdraw(req, res, next)

            expect(res.json).toHaveBeenCalled()
        })

        it("Should deposit error", async () => {
            accountsService.withdraw.mockImplementation(() => {
                throw new Error()
            })

            await withdraw(req, res, next)

            expect(next).toHaveBeenCalled()
        })
    })
})