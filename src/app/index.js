const express = require('express')
require('./db/mongoose') //connect to the database
const userRouter = require('./resources/users-resource')
const taskRouter = require('./resources/task-resource')

//configure express
const app = express()
app.use(express.json()) //parse json
app.use(userRouter)
app.use(taskRouter)

//configure port
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('server is up on port', port)
})