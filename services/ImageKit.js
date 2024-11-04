const ImageKit = require('imagekit')
const fs = require('fs')

class ImageKitService{
    constructor(){
        this.imageKit = new ImageKit({
            publicKey: 'public_te4UYUpNlow9zYDPpuA9bsNCVbo=',
            privateKey: 'private_hA4yUAElcWe9uH1oDWlCLjXKjDI=',
            urlEndpoint: 'https://ik.imagekit.io/azumidesu/'
        })
    }

    async upload(path, name){
        try{
            const file = fs.readFileSync(path)
            const res = await this.imageKit.upload({
                file: file,
                fileName: name
            })

            console.log(res)
        }
        catch (err){
            console.log(err)
        }
    }

    async uploadFromBuffer(buffer, name){
        try{
            const res = await this.imageKit.upload({
                file: buffer,
                fileName: name
            })

            console.log(res)
        }
        catch (err){
            console.log(err)
        }
    }
}

module.exports = {
    ImageKitService
}