const { Router } = require('express')
const { forgotPassword, reset } = require('../handler/Forgot')

const router = Router()

router.post('/', forgotPassword)
router.post('/reset', reset)

module.exports = {
    Forgot: router
}