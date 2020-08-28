const mongoose = require('mongoose')
const validator = require('validator')

module.exports = mongoose.model('User', {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            return validator.isEmail(value)
        }
    },
    age: {
        type: Number,
        default: 18,
        minlength: 2,
        validate(value) {
            if (value < 18) {
                throw new Error('age must be 18 or above')
            }
        }
    }
})