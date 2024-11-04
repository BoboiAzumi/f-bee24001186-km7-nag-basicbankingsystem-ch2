const readlineSync = require('readline-sync')
const BankAccount = require('./bank_account.js')
const Human = require('./human.js')

// Helper polymorphism
const Banking = HumanClass => class extends HumanClass{
    constructor(nama){
        super(nama)
        this.bankAccount = new BankAccount()
    }
}

// Implementasi inheritance dan polymorphism
class UserBank extends Banking(Human){
    constructor(nama, rekening, pin){
        super(nama)
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
        this.account.push(new UserBank('Naufal Azmi G', '12345', '1234'))
        this.account.push(new UserBank('Shinomiya Azumi', '54321', '1234'))
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
                reject('Error: Kesalahan sistem')
            }
        })
    }

    async doDeposit(credential, ammount){
        try{
            const auth = await this.#auth(credential)
            if(!auth){
                return {
                    status: 'FAILED',
                    message: 'Error: Kesalahan Kredensial'
                }
            }

            const account = this.account.find((v) => v.getRekening() == auth.rekening)
            const depositTransaction = new Promise((resolve, reject) => {
                // Implementasi setTimeout untuk simulasi proses asynchronous
                setTimeout(async () => {
                    try{
                        await account.getBankAccount().deposit(ammount)
                        resolve(true)
                    }
                    catch{
                        reject(new Error('Kegagalan Sistem'))
                    }
                }, 1000)
            })

            await depositTransaction

            return {
                status: 'SUCCESS'
            }
        }
        catch(error){
            return {
                status: 'FAILED',
                message: error.message
            }
        }
    }

    async doWithdraw(credential, ammount){
        try{
            const auth = await this.#auth(credential)
            if(!auth){
                return {
                    status: 'FAILED',
                    message: 'Error: Kesalahan Kredensial'
                }
            }

            const account = this.account.find((v) => v.getRekening() == auth.rekening)
            

            const withdrawTransaction = new Promise((resolve, reject) => {
                // Implementasi setTimeout untuk simulasi proses asynchronous
                setTimeout(async () => {
                    try{
                        if(await account.getBankAccount().withdraw(ammount)){
                            resolve(true)
                        }
                        else{
                            reject(new Error('Saldo tidak mencukupi'))
                        }
                    }
                    catch{
                        reject(new Error('Kegagalan Sistem'))
                    }
                }, 1000)
            })

            await withdrawTransaction
            
            return {
                status: 'SUCCESS'
            }
        }
        catch(error){
            return {
                status: 'FAILED',
                message: error.message
            }
        }
    }

    async doCekSaldo(credential){
        try{
            const auth = await this.#auth(credential)
            if(!auth){
                return {
                    status: 'FAILED',
                    message: 'Error: Kesalahan Kredensial'
                }
            }

            const account = this.account.find((v) => v.getRekening() == auth.rekening)

            const cekSaldo = new Promise((resolve, reject) => {
                // Implementasi setTimeout untuk simulasi proses asynchronous
                setTimeout(async () => {
                    try{
                        const saldo = account.getBankAccount().cekSaldo()
                        resolve(saldo)
                    }
                    catch{
                        reject(new Error('Kegagalan Sistem'))
                    }
                }, 1000)
            })
            const saldo = await cekSaldo
            
            return {
                status: 'SUCCESS',
                saldo
            }
        }
        catch(error){
            return {
                status: 'FAILED',
                message: error.message
            }
        }
    }

    async getNama(credential){
        try{
            const auth = await this.#auth(credential)
            if(!auth){
                return {
                    status: 'FAILED',
                    message: 'Error: Kesalahan Kredensial'
                }
            }

            const account = this.account.find((v) => v.getRekening() == auth.rekening)
            
            return {
                status: 'SUCCESS',
                nama: account.getNama()
            }
        }
        catch(error){
            return {
                status: 'FAILED',
                message: error.message
            }
        }
    }

    async doSign(rekening, pin){
        try{
            const cekAkun = new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try{
                        const account = this.account.find((v) => v.getRekening() === rekening && v.getPin() === pin)
                        resolve(account)
                    }
                    catch{
                        reject(true)
                    }
                }, 1000)
            })
            const account = await cekAkun
            if(!account){
                return {
                    status: 'FAILED',
                    message: 'Rekening atau pin anda salah'
                }
            }

            const cred = new Date().getMilliseconds() + 'PIN' + new Date().getTime()

            this.credential.push({
                cred,
                rekening
            })

            return {
                status: 'SUCCESS',
                cred
            }
         }
        catch{
            return {
                status: 'ERROR',
                message: 'Error: Kesalahan Sistem',
            };
        }
    }
}

const bankingSystem = new BankingSystem('Azumi')

function prompt(selector){
    switch(selector){
        case 1:
            console.log('Pilih Menu : ')
            console.log('1. Sign in')
            console.log('2. Shutdown')
            break
        case 2:
            console.log('Pilih Mode : ')
            console.log('1. Cek Saldo')
            console.log('2. Deposit')
            console.log('3. Withdraw')
            console.log('4. Sign Out')
            break
        case 3:
            console.log('\n')
            break
        case 4:
            console.log('BYE BYE !')
            break
        case 5:
            console.log('Input tidak valid')
            break
        case 6:
            console.log('=========================================')
            break
        case 7:
            console.log('Loading ...')
            break
    }
}

async function main(){
    let loop = true
    while(loop){
        let session = null
        prompt(6)
        prompt(1)
        const input_1 = parseInt(readlineSync.question('=> '))
        
        switch(input_1){
            case 1:
                prompt(6)
                const rekening = readlineSync.question('Masukkan no rekening => ')
                const pin = readlineSync.question('Masukkan pin => ')
                prompt(7)
                const cred = await bankingSystem.doSign(rekening, pin)
                switch (cred.status) {
                    case 'SUCCESS':
                        session = cred.cred;
                        break;
                    case 'FAILED':
                        prompt(6)
                        console.log(cred.message);
                        break
                    case 'ERROR':
                        prompt(6)
                        console.log(cred.message);
                        break
                }
                break
            case 2:
                loop = false
                prompt(4)
                prompt(6)
                break
            default:
                prompt(6)
                prompt(5)
        }
        
        while(session != null){
            prompt(6)
            const namaObj = await bankingSystem.getNama(session)
            const nama = namaObj.status != 'FAILED' ? namaObj.nama : namaObj.message
            console.log(`Halo ${nama}, Selamat datang di bank ${bankingSystem.bank_name}`)
            prompt(6)
            prompt(2)
            const input_2 = parseInt(readlineSync.question('=> '))
            let ammount = 0
            
            switch(input_2){
                case 1:
                    prompt(7)
                    prompt(6)
                    const saldo = await bankingSystem.doCekSaldo(session)
                    if(saldo.status === 'FAILED'){
                        console.log(saldo.message)
                        readlineSync.question('[Tekan Enter]=> ')
                        break
                    }
                    console.log(`Saldo anda : ${saldo.saldo}`)
                    readlineSync.question('[Tekan Enter]=> ')
                    break
                case 2:
                    prompt(6)
                    ammount = parseInt(readlineSync.question('Ammount => '))
                    prompt(7)
                    const deposit = await bankingSystem.doDeposit(session, ammount)

                    if(deposit.status === 'FAILED'){
                        console.log(deposit.message)
                        readlineSync.question('[Tekan Enter]=> ')
                        break
                    }
                    
                    console.log('Berhasil Deposit')
                    readlineSync.question('[Tekan Enter]=> ')
                    break
                case 3:
                    prompt(6)
                    ammount = parseInt(readlineSync.question('Ammount => '))
                    prompt(7)
                    const withdraw = await bankingSystem.doWithdraw(session, ammount)

                    if(withdraw.status === 'FAILED'){
                        console.log(withdraw.message)
                        readlineSync.question('[Tekan Enter]=> ')
                        break
                    }
                    
                    console.log('Berhasil Withdraw')
                    readlineSync.question('[Tekan Enter]=> ')
                    break
                case 4:
                    prompt(6)
                    session = null
                    prompt(4)
                    break
                default:
                    prompt(6)
                    prompt(5)
            }
        }
    }
}

main()