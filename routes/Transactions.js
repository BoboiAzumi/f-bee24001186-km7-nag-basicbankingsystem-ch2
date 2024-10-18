const { Router } = require("express")
const { transfer, getAllTransactions, getTransactionsBy } = require("../handler/Transactions")

const router = Router()

/*******************************************************
    JSON REQUEST FORMAT  (New Accounts)
    POST /api/v1/transactions
    
    {
        "data": {
            "sourceBankAccountNumber": <source bank account number (rekening asal)>,
            "destinationBankAccountNumber": <destination bank account number (rekening tujuan)>,
            "amount": <amount>
        }
    }
******************************************************/
router.post("/", transfer)

router.get("/", getAllTransactions)
router.get("/:id", getTransactionsBy)

module.exports = router