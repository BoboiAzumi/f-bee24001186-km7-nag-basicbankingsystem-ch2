const { prisma } = require("../db/Client")
const Joi = require("joi")

const transfer_validation = Joi.object({
    sourceBankAccountNumber: Joi.number().required(),
    destinationBankAccountNumber: Joi.number().required(),
    amount: Joi.number().required()
})

class TransactionsService{
    constructor(){
        this._tbTransactions = prisma.transaction
        this._tbBankAccounts = prisma.bankAccount
    }

    async transfer(data){
        try{
            const {sourceBankAccountNumber, destinationBankAccountNumber, amount} = data

            const validation = transfer_validation.validate({
                sourceBankAccountNumber,
                destinationBankAccountNumber,
                amount
            })

            if(validation.error){
                throw new Error(validation.error)
            }

            const source = await this._tbBankAccounts.findMany({where: {bankAccountNumber: sourceBankAccountNumber}})
            const destination = await this._tbBankAccounts.findMany({where: {bankAccountNumber: destinationBankAccountNumber}})

            if(source.length == 0 || destination == 0){
                throw new Error("Source bank account number or destination bank account number invalid")
            }

            if(amount > source[0].balance){
                throw new Error("Insufficient balance")
            }

            if(sourceBankAccountNumber == destinationBankAccountNumber){
                throw new Error("Unable to make transfer to the same account")
            }

            await prisma.$transaction([
                this._tbTransactions.create({data: {
                    sourceAccountId: source[0].id,
                    destinationAccountId: destination[0].id,
                    amount
                }}),
                this._tbBankAccounts.update({where: {id: source[0].id}, data: {balance: source[0].balance - amount}}),
                this._tbBankAccounts.update({where: {id: destination[0].id}, data: {balance: destination[0].balance + amount}}),
            ])
        }
        catch(e){
            throw e
        }
    }

    async getAllTransactions(){
        try{
            return await this._tbTransactions.findMany({})
        }
        catch(e){
            throw e
        }
    }

    async getTrasactionBy(c){
        try{
            return await this._tbTransactions.findMany({where: c, include: {source: true, destination: true}})
        }
        catch(e){
            throw e
        }
    }
}

module.exports = {
    TransactionsService
}