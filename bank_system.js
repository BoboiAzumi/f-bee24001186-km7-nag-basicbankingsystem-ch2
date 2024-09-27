const readlineSync = require("readline-sync")
const BankAccount = require("./bank_account.js")
const Human = require("./human")

// Helper polymorphism
const Banking = Base => class extends Base{
    constructor(){
        this.bankAccount = new BankAccount()
    }
}

// Implementasi inheritance dan polymorphism
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
        // Simulasi database akun
        this.account = []

        // Simulasi Session
        this.credential = []

        // Nama Bank
        this.bank_name = name

        // Buat simulasi database account
        this._createDummyAccount()
    }

    // Simulasi insert database, sekaligus simulasi database account (implementasi protected encapsulation)
    _createDummyAccount(){
        this.account.push(new UserBank("Naufal Azmi G", "12345", "1234"))
        this.account.push(new UserBank("Shinomiya Azumi", "54321", "1234"))
    }

    // Implementasi private
    #auth(credential){
        // Implementasi promise
        return new Promise((resolve, reject) => {
            try{
                const check = this.credential.find(v => v.cred == credential)
    
                if(check){
                    resolve(check)
                }
    
                resolve(false)
            }
            catch{
                reject("Error: Kesalahan sistem")
            }
        })
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