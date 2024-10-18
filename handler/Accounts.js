const { AccountsService } = require("../services/Accounts")
const { UsersProfilesService } = require("../services/UsersProfiles")

const accounts = new AccountsService()
const usersProfiles = new UsersProfilesService()

async function createAccount(req, res, next){
    try{
        const countUser = await usersProfiles.findBy({id: req.body.data.userId})
        if(countUser.length == 0) throw new Error(`User with id ${req.body.data.userId} not found`)
        await accounts.create({
            userId: req.body.data.userId,
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
        const findAccounts = await accounts.getAllAccounts()
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
        const findAccounts = await accounts.getAccountBy({id: parseInt(req.params.id)})
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
        await accounts.updateAccount({id: id}, req.body.data)
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
        await accounts.deleteUserProfile(id)
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
        await accounts.deposit(id, req.body.data.amount)
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
        await accounts.withdraw(id, req.body.data.amount)
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