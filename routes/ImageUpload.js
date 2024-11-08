const { Router } = require('express')
const { imageUpload, imageGet, imageGetDetail, imageUpdateDetail, imageDelete } = require('../handler/ImageUpload')
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ 
    storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
}).single('img');

async function middleware(req, res, next){
    upload(req, res, (err) => {
        if(err) {
            return next(err)
        }
        return next()
    })
}

const router = Router()

router.get('/', imageGet)
router.post('/', middleware, imageUpload)
router.get('/:id', imageGetDetail)
router.patch('/:id', imageUpdateDetail)
router.delete('/:id', imageDelete)

module.exports = {
    ImageUpload: router
}