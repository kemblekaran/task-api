const mongoose = require('mongoose')

const db = mongoose.connect(process.env.DB_CONNECTION_URL, { useNewUrlParser: true, useCreateIndex: true })
    .then((result) => {
        console.log('connected to the database')
    }).catch((error) => {
        console.log('problem connecting to the database', error)
    })