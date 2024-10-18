const { UsersProfilesService } = require("../services/UsersProfiles")
const user = new UsersProfilesService()

async function getAllUsers(req, res, next){
    try{
        const users = await user.findAll()
        res.json({
            status: "OK",
            data: users
        })
    }
    catch(e) {
        next(e)
    }
}

async function getUserById(req, res, next){
    try{
        const users = await user.findBy({id: parseInt(req.params.id)}, true)
        res.json({
            status: "OK",
            data: users[0] ? users[0] : {}
        })
    }
    catch(e) {
        next(e)
    }
}

async function newUser(req, res, next){
    try{
        await user.create(req.body.data)
        res.status(201)
        res.json({
            status: "SUCCESS"
        })
    }
    catch(e){
        if(e.name == "PrismaClientValidationError"){
            console.log(e)
            next(new Error("Data tidak lengkap"))
        }
        else{
            next(e)
        }
    }
}

async function updateUser(req, res, next){
    try{
        await user.updateUser({id: parseInt(req.params.id)}, req.body.data)
        res.json({
            status: "SUCCESS"
        })
    }
    catch(e){
        next(e)
    }
}

async function updateProfile(req, res, next){
    try{
        await user.updateProfile(parseInt(req.params.id), req.body.data)
        res.json({
            status: "SUCCESS"
        })
    }
    catch(e){
        next(e)
    }
}

async function deleteUserProfile(req, res, next){
    try{
        await user.deleteUserProfile(parseInt(req.params.id))
        res.json({
            status: "SUCCESS"
        })
    }
    catch(e){
        next(e)
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    newUser,
    updateUser,
    updateProfile,
    deleteUserProfile
}