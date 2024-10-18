const express = require("express")
const UsersProfilesRouter = require("./routes/UsersProfiles")
const AccountsRouter = require("./routes/Accounts")
const TransactionRouter = require("./routes/Transactions")

const app = express()

app.use(express.json())
app.use("/api/v1/users", UsersProfilesRouter)
app.use("/api/v1/accounts", AccountsRouter)
app.use("/api/v1/transactions", TransactionRouter)

app.use((err, req, res, next) => {
    if(err.name == "Error"){
        res.status(400)
    }
    else{
        res.status(500)
    }

    res.json({
        status: "ERROR",
        name: err.name,
        message: err.message,
        data: []
    })
})

app.listen(3000, () => console.log("Start on 3000"))