const { auth } = require('./helper/AuthorizationInstance')

async function Authorization(req, res, next){
    try{
        const { authorization } = req.headers
        const token = authorization.split(' ')
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
    catch (e){
        res.status(401).json({
            status: 'UNAUTHORIZED'
        })
    }
}

module.exports = {
    Authorization
}