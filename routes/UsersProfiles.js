const { Router } = require('express');
const { getAllUsers, newUser, getUserById, updateUser, updateProfile, deleteUserProfile } = require('../handler/UsersProfiles');

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

module.exports = router;
