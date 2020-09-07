const app = require('./app')

//configure port
const port = process.env.PORT
app.listen(port, () => {
    console.log('server is up on port', port)
})