const { Router } = require('express')
const User = require('../models/user')

const router = new Router()

router.get('/users/health', (req, res) => {
    res.send({
        message: 'user-api health is all good'
    })
})

//CRUD endpoints for User resource
//create new user
router.post('/users', async (req, res) => {

    console.log(req.body)
    try {
        const user = await new User(req.body).save()
        res.status(201).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

//fetch all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(500).send(error)
    }
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
router.patch('/user/:id', async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'age', 'email']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        if (!isValidOperation) {
            return res.status(404).send({ error: 'Invalid update' })
        }

        console.log('updates', updates)
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

//delete a user
router.delete('/user/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        if (!deletedUser) {
            return res.status(404).send()
        }
        res.send(deletedUser)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router