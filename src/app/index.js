const express = require('express')
require('./db/mongoose')

const app = express()
app.use(express.json()) //parse json

//rest API's
app.get('', (req, res) => {
    res.send({
        message: 'task-api health is all good'
    })
})

//configure port
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('server is up on port', port)
})