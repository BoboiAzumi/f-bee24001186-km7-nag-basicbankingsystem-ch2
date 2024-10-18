const { prisma } = require("../db/Client")
const Joi = require("joi")

const create_validation = Joi.object({
    userId: Joi.number().required(),
    bankName: Joi.string().min(3).required()
})

const update_validation = Joi.object({
    userId: Joi.number(),
    bankName: Joi.string().min(3)
})

const identifier = Joi.object({
    id: Joi.number().required()
})

const wd = Joi.object({
    amount: Joi.number().required(),
    id: Joi.number().required()
})

class AccountsService{
    constructor(){
        this._tbBankAccounts = prisma.bankAccount
    }

    async create(account){
        const validation = create_validation.validate({
            userId: account.userId,
            bankName: account.bankName
        })

        if(validation.error){
            throw new Error(validation.error)
        }

        try{
            await prisma.$transaction([
                this._tbBankAccounts.create({data: account})
            ])
        }
        catch (e){
            throw e
        }
    }

    async getAllAccounts(){
        try{
            return this._tbBankAccounts.findMany({})
        }
        catch (e){
            throw e
        }
    }

    async getAccountBy(c, includeUser = false){
        try{
            return this._tbBankAccounts.findMany({where: c, include: {user: includeUser}})
        }
        catch (e){
            throw e
        }
    }

    async updateAccount(criteria, data){
        try{
            const validation = update_validation.validate({
                userId: data.userId,
                bankName: data.bankName
            })
    
            if(validation.error){
                throw new Error(validation.error)
            }
            await this._tbBankAccounts.update({
                where: criteria,
                data: {
                    bankName: data.bankName
                }
            })
        }
        catch{
            throw new Error("Failed to change data")
        }
    }

    async deleteUserProfile(accountId){
        try{
            const validation = identifier.validate({id: accountId})

            if(validation.error){
                throw new Error(validation.error)
            }

            await prisma.$transaction([
                this._tbBankAccounts.delete({where: {id: accountId}})
            ])
        }
        catch(e){
            if(e.name == "PrismaClientKnownRequestError"){
                throw new Error("Data cannot be found")
            }
            else{
                throw e
            }
        }
    }

    async deposit(id, amount){
        try{
            const validation = wd.validate({
                amount,
                id
            })
    
            if(validation.error){
                throw new Error(validation.error)
            }
            
            const account = await this._tbBankAccounts.findMany({where: {id}})

            if(account.length == 0){
                throw new Error("Account not found")
            }

            await this._tbBankAccounts.update({where: {id}, data: { balance: account[0].balance + amount}})
        }
        catch (e){
            throw e
        }
    }

    async withdraw(id, amount){
        try{
            const validation = wd.validate({
                amount,
                id
            })
    
            if(validation.error){
                throw new Error(validation.error)
            }

            const account = await this._tbBankAccounts.findMany({where: {id}})

            if(account.length == 0){
                throw new Error("Account not found")
            }

            await this._tbBankAccounts.update({where: {id}, data: { balance: account[0].balance - amount}})
        }
        catch (e){
            throw e
        }
    }
}

module.exports = {
    AccountsService
}