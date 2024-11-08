const ImageKit = require('imagekit')
const dotenv = require('dotenv')

dotenv.config()

const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: 'https://ik.imagekit.io/azumidesu/'
})

module.exports = {
    imageKit
}