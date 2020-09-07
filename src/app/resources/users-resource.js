const { Router } = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth') //attaches middleware functinality to the route
const { sendWelcomeEamil, sendCancellationEamil } = require('../emails/account')


const router = new Router()

router.get('/users/health', (req, res) => {
    res.send({
        message: 'user-api health is all good'
    })
})

//CRUD endpoints for User resource
//create new user
router.post('/users', async (req, res) => {

    try {
        const user = await new User(req.body).save()
        const token = await user.generateAuthToken()
        sendWelcomeEamil(user.email, user.name) //send welcome email
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(500).send(error)
    }
})

//reads profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//update user
router.patch('/users/me', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'age', 'email', 'password']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        if (!isValidOperation) {
            return res.status(404).send({ error: 'Invalid update' })
        }

        //loop through the properties which are being updated and set its value
        //so that our middleware will work which is defined in the use model
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

//delete a user
router.delete('/user/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancellationEamil(req.user.email, req.user.name)//send account deletion email
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logout/:type', auth, async (req, res) => {
    try {

        //if the request has type as all then remove all the tokens 
        //that is logging out the user from all the active sessions
        if (req.params.type == 1) {
            req.user.tokens = []
        }

        //remove single token
        if (req.params.type == 0) {
            req.user.tokens = req.user.tokens.filter((tokenToFilter) => {
                return tokenToFilter.token !== req.token
            })
        }

        //store updated user with new tokens info
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//resource for uploading user profile picture
const uploadAvatar = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!['png', 'jpg', 'jpeg'].includes(file.originalname.split('.')[1])) {
            return callback(new Error('Please upload avatar in either PNG, JPG or JPEG'))
        }
        callback(undefined, true)

    }
})
//fourth argument to the function allows to send custom error message instead of sending
//express error message to the client
router.post('/users/me/avatar', auth, uploadAvatar.single('avatar'), async (req, res) => {
    const sharpBuffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
    req.user.avatar = sharpBuffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

//route for deleting the user avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send({ error })
    }
})

router.get('/user/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})
module.exports = router