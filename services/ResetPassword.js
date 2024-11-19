const nodemailer = require('nodemailer')
const env = require('dotenv')

env.config()

async function testNodeMailer(email){
    const mailer = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 456,
        secure: true,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASS
        }
    })

    return await mailer.sendMail({
        from: 'akubukahnhantu0704@gmail.com',
        to: email,
        subject: 'TEST',
        text: 'HELLO WORLD'
    })
}
/*
class ResetPassword{
    
}
*/

module.exports = {
    testNodeMailer
}