const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            return validator.isEmail(value)
        }
    },
    password: {
        type: String,
        required: true
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

//middleware
//perform operations before storing data to the database
//needs to be normal ES6 function instead of the arrow function 
//so that to work binding
userSchema.pre('save', async function (next) {
    const user = this //references to the current object passed to persist in the userSchema

    //check if the field "password" is modified or not with isModified property 
    //on the object we get inside of the pre function on mongoose schema
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next() //continue doing other operations
})

userSchema.statics.findByCredentials = async (email, password) => {

    //the reference to User is taken from the below where we saved mongoose model in a variable named User
    const userByEmail = await User.findOne({ email })
    if (!userByEmail) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, userByEmail.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return userByEmail
}

const User = mongoose.model('User', userSchema)
module.exports = User