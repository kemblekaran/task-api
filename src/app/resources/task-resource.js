const { Router } = require('express')
const Task = require('../models/task')

const router = new Router()

router.get('/task/health', (req, res) => {
    res.send({
        message: 'task-api health is all good'
    })
})

//CRUD endpoints for task resource
//create task
router.post('/tasks', async (req, res) => {
    try {
        const task = await new Task(req.body).save()
        res.status(201).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

//fetch all task
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

//fetch individual task
router.get('/task/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).send(task)
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

//update task
router.patch('/task/:id', async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['description', 'completed']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        if (!isValidOperation) {
            return res.status(404).send({ error: 'Invalid update' })
        }

        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

//delete a task
router.delete('/task/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id)
        if (!deletedTask) {
            return res.status(404).send()
        }

        res.send(deletedTask)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router