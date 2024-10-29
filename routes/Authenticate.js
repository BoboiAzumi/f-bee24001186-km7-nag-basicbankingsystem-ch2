const { Router } = require("express")
const { auth } = require("../handler/Auth")

const router = Router()

router.post("/", auth)

module.exports = {
    Authenticate: router
}