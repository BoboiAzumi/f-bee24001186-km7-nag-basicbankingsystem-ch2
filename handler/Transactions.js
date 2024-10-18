const { TransactionsService } = require("../services/Transactions")

const transaction = new TransactionsService()

async function transfer(req, res, next){
    try{
        await transaction.transfer(req.body.data)
        res.status(201)
        res.json({
            status: "OK"
        })
    }
    catch(e) {
        next(e)
    }
}

async function getAllTransactions(req, res, next){
    try{
        const transactions = await transaction.getAllTransactions()
        res.json({
            status: "OK",
            data: transactions
        })
    }
    catch(e) {
        next(e)
    }
}

async function getTransactionsBy(req, res, next){
    try{
        const transactions = await transaction.getTrasactionBy({id: parseInt(req.params.id)})
        res.json({
            status: "OK",
            data: transactions
        })
    }
    catch(e){
        next(e)
    }
}

module.exports = {
    transfer,
    getAllTransactions,
    getTransactionsBy
}