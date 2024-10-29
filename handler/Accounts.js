const { accountsService } = require("./helper/AccountServiceInstance")
const { usersProfilesService } = require("./helper/UsersProfilesServiceInstance")

async function createAccount(req, res, next){
    try{
        const countUser = await usersProfilesService.findBy({id: req.user.id})
        if(countUser.length == 0) throw new Error(`User with id ${req.user.id} not found`)

        await accountsService.create({
            userId: req.user.id,
            bankName: req.body.data.bankName
        })
        res.status(201)
        res.json({
            status: "OK"
        })
    }
    catch(e) {
        next(e)
    }
}

async function getAllAccounts(req, res, next){
    try{
        const findAccounts = await accountsService.getAccountBy({userId: req.user.id})
        res.json({
            status: "OK",
            data: findAccounts
        })
    }
    catch(e) {
        next(e)
    }
}

async function getAccountById(req, res, next){
    try{
        const findAccounts = await accountsService.getAccountBy({id: parseInt(req.params.id), userId: req.user.id})
        res.json({
            status: "OK",
            data: findAccounts[0] ? findAccounts[0] : {}
        })
    }
    catch(e) {
        next(e)
    }
}

async function updateAccount(req, res, next){
    const id = parseInt(req.params.id)
    try{
        await accountsService.updateAccount({id: id, userId: req.user.id}, req.body.data)
        res.json({
            status: "OK"
        })
    }
    catch(e) {
        next(e)
    }
}

async function deleteAccount(req, res, next){
    const id = parseInt(req.params.id)
    try{
        await accountsService.deleteBankAccount(id, req.user.id)
        res.json({
            status: "OK"
        })
    }
    catch(e) {
        next(e)
    }
}

async function deposit(req, res, next){
    const id = parseInt(req.params.id)
    try{
        await accountsService.deposit(id, req.body.data.amount, req.user.id)
        res.json({
            status: "OK"
        })
    }
    catch(e) {
        next(e)
    }
}

async function withdraw(req, res, next){
    const id = parseInt(req.params.id)
    try{
        await accountsService.withdraw(id, req.body.data.amount, req.user.id)
        res.json({
            status: "OK"
        })
    }
    catch(e) {
        next(e)
    }
}

module.exports = {
    createAccount,
    getAllAccounts,
    getAccountById,
    updateAccount,
    deleteAccount,
    withdraw,
    deposit
}