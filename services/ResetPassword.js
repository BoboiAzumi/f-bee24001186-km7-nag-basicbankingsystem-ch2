const nodemailer = require('nodemailer')
const env = require('dotenv')
const { Auth } = require('../handler/helper/Authentication')
const { usersProfilesService } = require('../handler/helper/UsersProfilesServiceInstance')
const ejs = require('ejs')
const { eventEmitter } = require('../socketEvent')

env.config()

class ResetPassword{
    static async sendEmailToken(email){
        try{
            const token = await Auth.createResetToken(email)

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

            const template = ejs.renderFile('./views/email.ejs', {base_url: (process.env.BASE_URL || 'http://localhost:3000'), token})
            
            await mailer.sendMail({
                from: process.env.NODEMAILER_EMAIL,
                to: email,
                subject: 'Reset your password',
                html: (await template).toString()
            })

            eventEmitter.emit('calling', `Reset password has been sent to ${email}`)
            
        }
        catch(e){
            throw e
        }
    }
}

module.exports = {
    ResetPassword
}