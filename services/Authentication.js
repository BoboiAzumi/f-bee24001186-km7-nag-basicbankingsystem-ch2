const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { UsersProfilesService } = require('./UsersProfiles')
const dotenv = require('dotenv')

dotenv.config()

class Authentication{
    constructor(){
        this.UsersProfiles = new UsersProfilesService()
        this.secret = process.env.JWT_SECRET
    }

    async authentication(email, password){
        const find = await this.UsersProfiles.findFirst({
            email
        })

        if(!find){
            throw new Error('Email not found')
        }

        if(!(await bcrypt.compare(password, find.password))){
            throw new Error('Password is wrong')
        }

        const token = jwt.sign({
            id: find.id
        }, this.secret, {
            algorithm: 'HS256',
            expiresIn: '24h'
        })

        return token
    }
    
    async validation(token){
        if(!token){
            return false
        }
        try{
            const tokenDecrypt = jwt.verify(token, this.secret)
            const valid = await this.UsersProfiles.findFirst({id: tokenDecrypt.id})

            if(valid){
                return tokenDecrypt
            }
            else{
                return false   
            }            
        }
        catch{
            return false
        }
    }
}

module.exports = {
    Authentication
}