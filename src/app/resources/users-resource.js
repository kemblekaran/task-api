const { Router } = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth') //attaches middleware functinality to the route

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
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(500).send(error)
    }
})

//fetch all users
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//fetch user by id
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
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
        const userToBeUpdated = req.user
        updates.forEach((update) => userToBeUpdated[update] = req.body[update])
        await userToBeUpdated.save()
        res.send(userToBeUpdated)
    } catch (error) {
        res.status(500).send(error)
    }
})

//delete a user
router.delete('/user/me', auth, async (req, res) => {
    try {
        await req.user.remove()
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
        console.log(error)
        res.status(400).send()
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

module.exports = router