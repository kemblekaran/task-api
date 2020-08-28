const express = require('express')
require('./db/mongoose') //connect to the database
require('./resources/users-resource')//load the resources
const Task = require('./models/task')
const userRouter = require('./resources/users-resource')

//configure express
const app = express()
const port = process.env.PORT || 3000
app.use(express.json()) //parse json
app.use(userRouter)

//task api
app.post('/tasks', (req, res) => {
    const task = new Task(req.body).save()
        .then((task) => {
            res.send(task)
        })
        .catch((error) => {
            res.status(400).send(error)
        })
})

app.get('/tasks', (req, res) => {
    Task.find({})
        .then((tasks) => {
            if (!tasks) {
                return res.status(404).send()
            }

            res.send(tasks)
        })
        .catch((error) => {
            res.status(500).send(error)
        })
})

app.get('/tasks/:id', (req, res) => {
    Task.findById(req.params.id)
        .then((task) => {
            if (!task) {
                return res.status(404).send()
            }

            res.send(task)
        })
        .catch((error) => {
            res.status(500).send(error)
        })
})

//configure port
app.listen(port, () => {
    console.log('server is up on port', port)
})