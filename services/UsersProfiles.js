const { prisma } = require("../db/Client")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const { bcryptSalt } = require("../hash")

const create_schema = Joi.object({
    name: Joi.string().min(3).max(128).required(), // Max 128 karakter ?, karena nama dosen saya ada yang lebih dari 70 karakter :D
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    identityType: Joi.string().min(2).required(),
    identityNumber: Joi.string().min(4).required(),
    address: Joi.string().min(10).required()
})

const user_update_schema = Joi.object({
    name: Joi.string().min(3).max(128), // Max 128 karakter ?, karena nama dosen saya ada yang lebih dari 70 karakter :D
    email: Joi.string().email(),
    password: Joi.string().min(8)
})

const profile_update_schema = Joi.object({
    identityType: Joi.string().min(2),
    identityNumber: Joi.string().min(4),
    address: Joi.string().min(10)
})

const identifier = Joi.object({
    id: Joi.number().required()
})

class UsersProfilesService {
    constructor(){
        this._tbUsers = prisma.user
        this._tbProfile = prisma.profile
    }

    async create(user){
        try{
            const validation = create_schema.validate({
                name: user.name, 
                email: user.email, 
                password: user.password,
                identityType: user.profile.identityType,
                identityNumber: user.profile.identityNumber,
                address: user.profile.address
            })

            if(validation.error){
                throw new Error(validation.error)
            }

            await prisma.$transaction([
                this._tbUsers.create({ data: {
                    name: user.name,
                    email: user.email,
                    password: await bcrypt.hash(user.password, bcryptSalt),
                    profile: {
                        create: [
                            {
                                identityType: user.profile.identityType,
                                identityNumber: user.profile.identityNumber,
                                address: user.profile.address
                            }
                        ]
                    }
                }})
            ])
        }
        catch (e){
            throw e
        }
    }

    async findAll(){
        try{
            return this._tbUsers.findMany()
        }
        catch{
            throw new Error("Failed to fetch all data")
        }
    }

    async findBy(c, includeProfile = false){
        try{
            return this._tbUsers.findMany({where : c, include: { profile: includeProfile }})
        }
        catch{
            throw new Error("Failed to fetch data")
        }
    }

    async findFirst(c, includeProfile = false){
        try{
            return this._tbUsers.findFirst({where : c, include: { profile: includeProfile }})
        }
        catch{
            throw new Error("Failed to fetch data")
        }
    }

    async updateUser(criteria, data){
        try{
            const validation = user_update_schema.validate({
                name: data.name, 
                email: data.email, 
                password: await bcrypt.hash(data.password, bcryptSalt)
            })

            if(validation.error){
                throw new Error(validation.error)
            }

            await this._tbUsers.update({
                where: criteria,
                data: validation.value
            })
        }
        catch (e){
            throw e
        }
    }
    
    async updateProfile(userId, data){
        try{
            const validation = profile_update_schema.validate({
                identityType: data.identityType,
                identityNumber: data.identityNumber,
                address: data.address
            })

            if(validation.error){
                throw new Error(validation.error)
            }

            await prisma.$transaction([
                this._tbProfile.update({
                    where: {userId},
                    data
                })
            ])
        }
        catch(e){
            throw e
        }
    }

    async deleteUserProfile(userId){
        try{
            const validation = identifier.validate({id: userId})

            if(validation.error){
                throw new Error(validation.error)
            }

            await prisma.$transaction([
                this._tbUsers.delete({where: {id: userId}})
            ])
        }
        catch(e){
            if(e.name == "PrismaClientKnownRequestError"){
                throw new Error("Data cannot be found")
            }
            else{
                throw e
            }
        }
    }
}

module.exports = { UsersProfilesService }