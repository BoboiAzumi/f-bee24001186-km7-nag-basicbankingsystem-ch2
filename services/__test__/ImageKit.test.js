const { ImageKitService } = require('../ImageKit')
const fs = require('fs')
const { imageKit } = require('../helper/ImageKitInstance')
const { prisma } = require('../../db/Client')

jest.mock('fs', () => ({
    readFileSync: jest.fn()
}))

jest.mock('../helper/ImageKitInstance', () => ({
    imageKit: {
        upload: jest.fn(),
        deleteFile: jest.fn()
    }
}))

jest.mock('../../db/Client', () => ({
    prisma: {
        $transaction: jest.fn(),
        user: {
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findFirst: jest.fn()
        },
        profile: {
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        image: {
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn()
        }
    }
}))

describe('Test ImageKit Service', () => {
    let service
    
    beforeEach(() => {
        service = new ImageKitService()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('Upload Image', () => {
        it('Should upload image', async () => {
            const path = '/'
            const filename = 'aabbccdd'
            const url = 'https://'
            const fileId = '8899000'

            fs.readFileSync.mockReturnValueOnce('GAMBAR')

            imageKit.upload.mockReturnValueOnce({
                url,
                fileId
            })

            await service.upload(path, filename, {
                id: 1,
                title: 'aabbccdd',
                description: 'aabbccdd'
            })

            expect(imageKit.upload).toHaveBeenCalled()
            expect(prisma.image.create).toHaveBeenCalled()
        })

        it('Should error', async () => {
            const path = '/'
            const filename = 'aabbccdd'
            imageKit.upload.mockImplementation(() => {
                throw new Error()
            })
            await expect(service.upload(path, filename)).rejects.toThrow()
        })
    })

    describe('Upload Image (File Only)', () => {
        it('Should upload image', async () => {
            const path = '/'
            const filename = 'aabbccdd'
            const url = 'https://'
            const fileId = '8899000'

            fs.readFileSync.mockReturnValueOnce('GAMBAR')

            imageKit.upload.mockReturnValueOnce({
                url,
                fileId
            })

            await service.uploadFileOnly(path, filename, {
                id: 1,
                title: 'aabbccdd',
                description: 'aabbccdd'
            })

            expect(imageKit.upload).toHaveBeenCalled()
        })

        it('Should error', async () => {
            const path = '/'
            const filename = 'aabbccdd'
            imageKit.upload.mockImplementation(() => {
                throw new Error()
            })
            await expect(service.uploadFileOnly(path, filename)).rejects.toThrow()
        })
    })

    describe('Get All Image', () => {
        it('Should get all image', async () => {
            prisma.image.findMany.mockReturnValueOnce('Sate kerang wibowo')

            const result = await service.getAllImage()

            expect(result).toEqual('Sate kerang wibowo')
        })

        it('Should error', async () => {
            prisma.image.findMany.mockImplementation(() => {
                throw new Error()
            })

            await expect(service.getAllImage()).rejects.toThrow()
        })
    })

    describe('Get Image By', () => {
        it('Should get image by id', async () => {
            prisma.image.findUnique.mockReturnValueOnce('Sate kerang wibowo')

            const result = await service.getImageBy({id: 1})

            expect(result).toEqual('Sate kerang wibowo')
        })

        it('Should error', async () => {
            prisma.image.findUnique.mockImplementation(() => {
                throw new Error()
            })

            await expect(service.getImageBy({id: 1})).rejects.toThrow()
        })
    })

    describe('Update Image Detail', () => {
        it('Should update image detail', async () => {
            await service.updateImageDetail({id: 1}, {
                title: 'ABCD',
                description: 'ABCD'
            })

            expect(prisma.image.update).toHaveBeenCalledWith({
                where: {id: 1},
                data: {
                    title: 'ABCD',
                    description: 'ABCD'
                }
            })
        })

        it('Should error', async () => {
            await expect(service.updateImageDetail({id: 1}, {
                title: '',
                description: 'ABCD'
            })).rejects.toThrow()
        })
    })

    describe('Image delete by image id', () => {
        it('Should delete image', async () => {
            prisma.image.findUnique.mockReturnValueOnce({
                fileId: 1
            })

            await service.imageDeleteByImageId(10)

            expect(imageKit.deleteFile).toHaveBeenCalled()
            expect(prisma.image.delete).toHaveBeenCalled()
        })

        it('Should error', async () => {
            prisma.image.findUnique.mockImplementation(() => {
                throw new Error()
            })
            await expect(service.imageDeleteByImageId(10)).rejects.toThrow()
        })
    })

    describe('Image delete (in Imagekit)', () => {
        it('Should delete image (in Imagekit)', async () => {
            await service.deleteImage(10)

            expect(imageKit.deleteFile).toHaveBeenCalled()
        })

        it('Should error', async () => {
            imageKit.deleteFile.mockImplementation(() => {
                throw new Error()
            })
            await expect(service.deleteImage(10)).rejects.toThrow()
        })
    })
})