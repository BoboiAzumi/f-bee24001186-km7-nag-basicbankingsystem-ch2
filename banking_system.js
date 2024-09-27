const readlineSync = require("readline-sync")
const BankAccount = require("./bank_account.js")
const Human = require("./human.js")

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
        return this.rekening
    }

    getPin(){
        return this.pin
    }

    getBankAccount(){
        return this.bankAccount
    }
}

class BankingSystem{
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
        try{
            const auth = await this.#auth(credential)
            if(!auth){
                return {
                    status: "FAILED",
                    message: "Error: Kesalahan Kredensial"
                }
            }

            const account = this.account.find((v) => v.getRekening() == auth.rekening)
            await account.getbankAccount().deposit(ammount)

            return {
                status: "SUCCESS"
            }
        }
        catch(error){
            return {
                status: "FAILED",
                message: error.message
            }
        }
    }

    async doWithdraw(credential, ammount){
        try{
            const auth = await this.#auth(credential)
            if(!auth){
                return {
                    status: "FAILED",
                    message: "Error: Kesalahan Kredensial"
                }
            }

            const account = this.account.find((v) => v.getRekening() == auth.rekening)
            await account.getbankAccount().withdraw(ammount)
            
            return {
                status: "SUCCESS"
            }
        }
        catch(error){
            return {
                status: "FAILED",
                message: error.message
            }
        }
    }

    async doCekSaldo(credential){
        try{
            const auth = await this.#auth(credential)
            if(!auth){
                return {
                    status: "FAILED",
                    message: "Error: Kesalahan Kredensial"
                }
            }

            const account = this.account.find((v) => v.getRekening() == auth.rekening)
            const saldo = account.getbankAccount().cekSaldo()
            
            return {
                status: "SUCCESS",
                saldo
            }
        }
        catch(error){
            return {
                status: "FAILED",
                message: error.message
            }
        }
    }

    async doSign(rekening, pin){
        try{
            const account = this.account.find((v) => v.getRekening() === rekening && v.getPin() === pin)
            if(!account){
                return {
                    status: "FAILED",
                    message: "Rekening atau pin anda salah"
                }
            }

            const cred = new Date().getMilliseconds() + "PIN" + new Date().getTime()

            this.credential.push({
                cred,
                rekening
            })

            return {
                status: "SUCCESS",
                cred
            }
         }
        catch{
            return {
                status: "ERROR",
                message: "Error: Kesalahan Sistem",
            };
        }
    }
}

