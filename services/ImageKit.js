const fs = require('fs')
const { prisma } = require('../db/Client')
const joi = require('joi')
const { imageKit } = require('./helper/ImageKitInstance')

const validation = joi.object({
    title: joi.string().min(1),
    description: joi.string().min(1)
})


class ImageKitService{
    constructor(){
        this.imageKit = imageKit
    }

    async upload(file, name, info){
        try{
            const res = await this.imageKit.upload({
                file: file,
                fileName: name
            })

            await prisma.image.create({
                data: {
                    userId: info.id,
                    title: info.title,
                    description: info.description,
                    url: res.url,
                    fileId: res.fileId
                }
            })
        }
        catch (err){
            throw new Error(err.message)
        }
    }

    async uploadFileOnly(file, name){
        try{
            const res = await this.imageKit.upload({
                file: file,
                fileName: name
            })

            return res
        }
        catch (err){
            throw new Error(err.message)
        }
    }

    async getAllImage(){
        try{
            const result = await prisma.image.findMany()
            return result
        }
        catch (err){
            throw new Error(err.message)
        }
    }

    async getImageBy(by){
        try{
            const result = await prisma.image.findUnique({
                where: by
            })
            return result
        }
        catch (err){
            throw new Error(err.message)
        }
    }

    async updateImageDetail(by, data){
        try{
            const valid = validation.validate(data)
            if(valid.error) throw new Error(valid.error)
            await prisma.image.update({
                where: by,
                data
            })
        }
        catch (err){
            throw new Error(err.message)
        }
    }
    
    async imageDeleteByImageId(id){
        try{
            const image = await prisma.image.findUnique({
                where: {
                    id
                }
            })

            await this.imageKit.deleteFile(image.fileId)

            await prisma.image.delete({
                where: {
                    id
                }
            })
        }
        catch (err){
            throw new Error(err.message)
        }
    }

    async deleteImage(fileId){
        try{
            await this.imageKit.deleteFile(fileId)
        }
        catch (err){
            throw new Error(err.message)
        }
    }
}

module.exports = {
    ImageKitService
}