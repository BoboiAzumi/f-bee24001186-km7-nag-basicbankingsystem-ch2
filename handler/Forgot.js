const Joi = require('joi')
const { ResetPassword } = require('../services/ResetPassword')
const { Auth } = require('./helper/Authentication')
const { usersProfilesService } = require('./helper/UsersProfilesServiceInstance')
const { eventEmitter } = require('../socketEvent')

const validation = Joi.object({
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().min(8).required()
})

async function forgotPassword(req, res, next){
    try{
        await ResetPassword.sendEmailToken(req.body.email)

        return res.json({
            status: 'SUCCESS'
        })
    }
    catch(e){
        next(e)
    }
}

async function reset(req, res, next){
    try{
        const token = await Auth.validation(req.body.token)
        const valid = validation.validate({
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        })

        if(!token){
            throw new Error('Invalid Token')
        }

        if(valid.error){
            throw new Error(valid.error)
        }

        if(valid.value.password != valid.value.confirmPassword){
            throw new Error('Passwords do not match')
        }
        
        await usersProfilesService.updateUser({id: token.id}, {
            password: valid.value.password
        })

        eventEmitter.emit('calling', `User with id ${token.id} has changed password`)

        res.json({
            status: 'SUCCESS'
        })
    }
    catch(e){
        next(e)
    }
}

module.exports = {
    forgotPassword,
    reset
}