const mongoose = require('mongoose')

module.exports = mongoose.model('tasks', {
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