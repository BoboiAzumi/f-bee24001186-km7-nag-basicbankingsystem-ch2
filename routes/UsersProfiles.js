const { Router } = require('express');
const { getAllUsers, newUser, getUserById, updateUser, updateProfile, deleteUserProfile, uploadImage } = require('../handler/UsersProfiles');
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

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById)

/*******************************************************
    JSON REQUEST FORMAT  (New User)
    POST /api/v1/users
    
    {
        "data": {
            "name": "john doe",
            "email": "johndoe@gmail.com",
            "password": "12345678",
            "profile": {
                "identityType": "KTP",
                "identityNumber": "1023342764323",
                "address": "Alamat"
            }
        }
    }
******************************************************/
router.post('/', newUser);


/*******************************************************
    JSON REQUEST FORMAT  (Update User)
    PATCH /api/v1/users/:id

    {  
        "data": {
            "name": "new john doe",
            "email": "newjohndoe@gmail.com",
            "password": "new12345678"
        }
    }
******************************************************/
router.patch('/:id', updateUser)

/*******************************************************
    JSON REQUEST FORMAT  (Update Profile)
    PATCH /api/v1/users/:id/profile

    {  
        "data": {
            "identityType": "New Identity Type",
            "identityNumber": "New Number",
            "address": "New Alamat"
        }
    }
******************************************************/
router.patch('/:id/profile', updateProfile)

router.delete('/:id', deleteUserProfile)

router.post('/:id/profile/image', middleware, uploadImage)

module.exports = router;
