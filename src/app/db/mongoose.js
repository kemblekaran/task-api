const mongoose = require('mongoose')

const db = mongoose.connect('mongodb://127.0.0.1:27017/task-service', { useNewUrlParser: true, useCreateIndex: true })
    .then((result) => {
        console.log('connected to the database')
    }).catch((error) => {
        console.log('problem connecting to the database', error)
    })