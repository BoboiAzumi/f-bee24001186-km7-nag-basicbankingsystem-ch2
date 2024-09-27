class BankAccount{
    constructor(){
        // Deklarasikan variabel "saldo" dengan nilai awal (misalnya, 0)
        this.saldo = 0
    }

    // Method deposit, untuk menambahkan saldo
    deposit(ammount){
        this.saldo = this.saldo + ammount
    }

    // Method withdraw, untuk mengurangi saldo
    withdraw(ammount){
        if(ammount > this.saldo){
            return false
        }
        this.saldo = this.saldo - ammount
        return true
    }

    // Method cekSaldo, untuk menambahkan mengembalikan nilai saldo
    cekSaldo(){
        return this.saldo
    }
}