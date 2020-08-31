const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        minlength: 1
    },
    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('tasks', taskSchema)