const { transactionsService } = require('./helper/TransactionsServiceInstance')

async function transfer(req, res, next){
    try{
        await transactionsService.transfer({...req.body.data, userId: req.user.id})
        res.status(201)
        res.json({
            status: 'OK'
        })
    }
    catch(e) {
        next(e)
    }
}

async function getAllTransactions(req, res, next){
    try{
        const transactions = await transactionsService.getAllTransactions()
        res.json({
            status: 'OK',
            data: transactions
        })
    }
    catch(e) {
        next(e)
    }
}

async function getTransactionsBy(req, res, next){
    try{
        const transactions = await transactionsService.getTransactionBy({id: parseInt(req.params.id)})
        res.json({
            status: 'OK',
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