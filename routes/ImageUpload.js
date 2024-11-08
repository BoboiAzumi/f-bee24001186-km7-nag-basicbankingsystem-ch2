const { Router } = require('express')
const { imageUpload, imageGet, imageGetDetail, imageUpdateDetail, imageDelete } = require('../handler/ImageUpload')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = Router()

router.get('/', imageGet)
router.post('/', upload.single('img'), imageUpload)
router.get('/:id', imageGetDetail)
router.patch('/:id', imageUpdateDetail)
router.delete('/:id', imageDelete)

module.exports = {
    ImageUpload: router
}