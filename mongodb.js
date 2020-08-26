const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

mongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to the database')
    }

    console.log('connected to the database', databaseName)

    const db = client.db(databaseName)
    db.collection('users').insertOne({
        name: 'Karan Kemble',
        age: 23
    })
})