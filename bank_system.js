const readlineSync = require("readline-sync")
const BankAccount = require("./bank_account.js")
const Human = require("./human")

const Banking = Base => class extends Base{
    constructor(){
        this.bankAccount = new BankAccount()
    }
}

class UserBank extends Banking(Human){
    constructor(nama, rekening, pin){
        this.nama = nama
        this.rekening = rekening
        this.pin = pin
    }

    getNama(){
        return this.nama
    }

    getRekening(){
        return this.nama
    }

    getPin(){
        return this.nama
    }

    getBankingAccount(){
        return this.nama
    }
}

class BankSystem{
    constructor(name){
        // TODO
    }

    #auth(credential){
        // TODO
    }

    async doDeposit(credential, ammount){
        // TODO
    }

    async doWithdraw(credential, ammount){
        // TODO
    }

    async doCekSaldo(credential){
        // TODO
    }

    async doSign(rekening, pin){
        // TODO
    }
}