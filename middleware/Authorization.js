const { Authentication } = require("../services/Authentication")

const auth = new Authentication()

async function Authorization(req, res, next){
    try{
        const { authorization } = req.headers
        const token = authorization.split(" ")
        const verify = await auth.validation(token[1])

        if(verify.id){
            req.user = {
                id: verify.id
            }
            next()
        }
        else{
            throw new Error()
        }
    }
    catch{
        res.status(401).json({
            status: "UNAUTHORIZED"
        })
    }
}

module.exports = {
    Authorization
}