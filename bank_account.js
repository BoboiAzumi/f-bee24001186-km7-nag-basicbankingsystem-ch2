class BankAccount{
    constructor(){
        // Deklarasikan variabel "saldo" dengan nilai awal (misalnya, 0)
        this.saldo = 0
    }

    tambahSaldo(saldo){
        this.saldo = this.saldo + saldo
    }

    kurangiSaldo(saldo){
        if(saldo > this.saldo){
            return false
        }
        this.saldo = this.saldo - saldo
        return true
    }

    cekSaldo(){
        return this.saldo
    }
}

const bank = new BankAccount()

function refresh(){
    document.getElementById("saldo_display").innerHTML = bank.cekSaldo()
}

// Implementasikan fungsi "tambahSaldo()" yang akan menggunakan window.prompt()
function tambahSaldo(){
    let newSaldo = window.prompt("Berapa jumlah yang ingin ditambahkan ?")
    if(newSaldo == null){
        newSaldo = 0
    }
    newSaldo = parseInt(newSaldo)
    bank.tambahSaldo(newSaldo)

    // Setiap kali saldo diubah (ditambah atau dikurangi), tampilkan pesan kepada pengguna dengan menginformasikan saldo baru.
    alert("Saldo Sekarang "+bank.cekSaldo())
    try{
        refresh()
    }
    catch{
        console.log("Console Mode")
        console.log("Saldo : "+bank.cekSaldo())
    }
}

// Implementasikan fungsi "kurangiSaldo()" yang akan menggunakan window.prompt()
function kurangiSaldo(){
    let newSaldo = window.prompt("Berapa jumlah yang ingin dikurangi ?")
    if(newSaldo == null){
        newSaldo = 0
    }
    newSaldo = parseInt(newSaldo)
    if(!bank.kurangiSaldo(newSaldo)){
        alert("Saldo anda tidak cukup")
        return
    }

    // Setiap kali saldo diubah (ditambah atau dikurangi), tampilkan pesan kepada pengguna dengan menginformasikan saldo baru.
    alert("Saldo Sekarang "+bank.cekSaldo())
    try{
        refresh()
    }
    catch{
        console.log("Console Mode")
        console.log("Saldo : "+bank.cekSaldo())
    }
}

/*

Console Mode :
ketik tambahSaldo() untuk menambahkan saldo
ketik kurangiSaldo() untuk mengurangi saldo

Web Mode:
akses file index.html di browser
*/