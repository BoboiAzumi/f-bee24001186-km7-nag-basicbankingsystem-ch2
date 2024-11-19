const { imageKitService } = require('./helper/ImageKitServiceInstance')
const { usersProfilesService } = require('./helper/UsersProfilesServiceInstance')
const { randomize } = require('./helper/Randomize')
const { eventEmitter } = require('../socketEvent')

async function getAllUsers(req, res, next){
    try{
        const users = await usersProfilesService.findAll()
        res.json({
            status: 'OK',
            data: users
        })
    }
    catch(e) {
        next(e)
    }
}

async function getUserById(req, res, next){
    try{
        const users = await usersProfilesService.findBy({id: parseInt(req.params.id)}, true)
        res.json({
            status: 'OK',
            data: users[0] ? users[0] : {}
        })
    }
    catch(e) {
        next(e)
    }
}

async function newUser(req, res, next){
    try{
        await usersProfilesService.create(req.body.data)
        res.status(201)

        eventEmitter.emit('calling', `Hello, Welcome ${req.body.data.name}`)
        
        return res.json({
            status: 'SUCCESS'
        })
    }
    catch(e){
        if(e.name == 'PrismaClientValidationError'){
            next(new Error('Data tidak lengkap'))
        }
        else{
            next(e)
        }
    }
}

async function updateUser(req, res, next){
    try{
        await usersProfilesService.updateUser({id: parseInt(req.params.id)}, req.body.data)
        res.json({
            status: 'SUCCESS'
        })
    }
    catch(e){
        next(e)
    }
}

async function updateProfile(req, res, next){
    try{
        await usersProfilesService.updateProfile(parseInt(req.params.id), req.body.data)
        res.json({
            status: 'SUCCESS'
        })
    }
    catch(e){
        next(e)
    }
}

async function deleteUserProfile(req, res, next){
    try{
        await usersProfilesService.deleteUserProfile(parseInt(req.params.id))
        res.json({
            status: 'SUCCESS'
        })
    }
    catch(e){
        next(e)
    }
}

async function uploadImage(req, res, next){
    try{
        const user = await usersProfilesService.findFirst({id: parseInt(req.params.id)}, true)
        if(user.profile[0].imageFileId){
            imageKitService.deleteImage(user.profile[0].imageFileId)
        }

        const extension = req.file.originalname.split('.').pop()
        const fileName = randomize();

        const result = await imageKitService.uploadFileOnly(req.file.buffer.toString('base64'), `${fileName}.${extension}`)

        await usersProfilesService.updateImage(user.id, {
            imageUrl: result.url,
            imageFileId: result.fileId
        })

        res.json({
            status: 'OK'
        })
    }
    catch(e){
        console.log(e.message)
        next(e)
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    newUser,
    updateUser,
    updateProfile,
    deleteUserProfile,
    uploadImage
}