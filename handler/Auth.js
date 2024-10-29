const { Auth } = require("./helper/Authentication")

async function auth(req, res, next){
    try{
        const { email, password } = req.body.data
        const token = await Auth.authentication(email, password)

        res.json({
            status: "SUCCESS",
            token
        })
    }
    catch(e) {
        next(e)
    }
}

module.exports = {
    auth
}