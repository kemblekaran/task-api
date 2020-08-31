const { Router } = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new Router()

router.get('/task/health', (req, res) => {
    res.send({
        message: 'task-api health is all good'
    })
})

//CRUD endpoints for task resource
//create task
router.post('/tasks', auth, async (req, res) => {
    try {
        const task = await new Task({
            ...req.body,
            owner: req.user.id
        }).save()
        res.status(201).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

//fetch all task
router.get('/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user.id })
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

//fetch individual task
router.get('/task/:id', auth, async (req, res) => {
    try {

        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id })
        if (!task) {
            return res.status(404).send(task)
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

//update task
router.patch('/task/:id', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['description', 'completed']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        if (!isValidOperation) {
            return res.status(404).send({ error: 'Invalid update' })
        }

        //find the task by its ID
        // const taskToBeUpdated = await Task.findById(req.params.id)
        const taskToBeUpdated = await Task.findOne({ _id: req.params.id, owner: req.user.id })
        if (!taskToBeUpdated) {
            return res.status(404).send()
        }

        //Note: findByIdAndUpdate bypasses the middleware defined in the model
        //store task by traditional mongoose api instead of findByIdAndUpdate to get the
        //advantage of the middleware mongoose provides
        updates.forEach((update) => taskToBeUpdated[update] = req.body[update])
        await taskToBeUpdated.save()
        res.send(taskToBeUpdated)
    } catch (error) {
        res.status(500).send(error)
    }
})

//delete a task
router.delete('/task/:id', auth, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id })
        if (!deletedTask) {
            return res.status(404).send()
        }
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router