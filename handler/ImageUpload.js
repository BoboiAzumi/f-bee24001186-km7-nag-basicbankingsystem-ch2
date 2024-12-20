const { imageKitService } = require('./helper/ImageKitServiceInstance')
const { randomize } = require('./helper/Randomize')

async function imageUpload(req, res, next){
    try{
        if(!req.file){
            throw new Error('No found file')
        }
        if(!req.file.mimetype.startsWith('image/')){
            throw new Error('Invalid file')
        }
        if(!req.body.title || !req.body.description){
            throw new Error('Title or description must be string')
        }

        const extension = req.file.originalname.split('.').pop()
        const fileName = randomize();

        await imageKitService.upload(req.file.buffer.toString('base64'), `${fileName}.${extension}`, {
            id: req.user.id,
            title: req.body.title,
            description: req.body.description
        })

        res.json({
            status: 'OK'
        })
    }
    catch (e){
        next(e)
    }
}

async function imageGet(req, res, next){
    try{
        const images = await imageKitService.getAllImage()
        res.json({
            status: 'OK',
            data: images
        })
    }
    catch{
        next(e)
    }
}

async function imageGetDetail(req, res, next){
    try{
        const images = await imageKitService.getImageBy({id: parseInt(req.params.id)})
        res.json({
            status: 'OK',
            data: images
        })
    }
    catch (e){
        next(e)
    }
}

async function imageUpdateDetail(req, res, next){
    try{
        await imageKitService.updateImageDetail({id: parseInt(req.params.id)}, req.body.data)
        res.json({
            status: 'OK'
        })
    }
    catch (e){
        next(e)
    }
}

async function imageDelete(req, res, next){
    try{
        await imageKitService.imageDeleteByImageId(parseInt(req.params.id))

        res.json({
            status: 'OK'
        })
    }
    catch(e){
        next(e)
    }
}

module.exports = {
    imageUpload,
    imageGet,
    imageGetDetail,
    imageUpdateDetail,
    imageDelete
}