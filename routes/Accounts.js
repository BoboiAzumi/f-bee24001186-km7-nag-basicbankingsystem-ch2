const { Router } = require('express');
const { createAccount, getAllAccounts, getAccountById, updateAccount, deleteAccount, withdraw, deposit } = require('../handler/accounts');
const router = Router();

/*******************************************************
    JSON REQUEST FORMAT  (New Accounts)
    POST /api/v1/accounts
    
    {
        "data": {
            "bankName": "Bank X"
        }
    }
******************************************************/
router.post('/', createAccount)

router.get('/', getAllAccounts)

router.get('/:id', getAccountById)

/*******************************************************
    JSON REQUEST FORMAT  (Withdraw)
    PATCH /api/v1/accounts/:id/withdraw
    
    {
        "data": {
            "amount": <amount>
        }
    }
******************************************************/
router.patch('/:id/withdraw', withdraw)

/*******************************************************
    JSON REQUEST FORMAT  (Deposit)
    PATCH /api/v1/accounts/:id/deposit
    
    {
        "data": {
            "amount": <amount>
        }
    }
******************************************************/
router.patch('/:id/deposit', deposit)

/*******************************************************
    JSON REQUEST FORMAT  (Update Accounts)
    PATCH /api/v1/accounts/:id
    
    {
        "data": {
            "bankName": "Bank X"
        }
    }
******************************************************/
router.patch('/:id', updateAccount)

router.delete('/:id', deleteAccount)

module.exports = router