const mongoose = require('mongoose')
const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const User = require('../models/user')

//dummy user
const userId = new mongoose.Types.ObjectId
const userOne = {
    _id: userId,
    name: 'Samantha Johnson',
    email: 'johndoe@gmail.com',
    password: 'P@ss#123!!',
    tokens: [{
        token: jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('should create new account', async () => {
    await request(app).post('/users').send({
        name: 'Jonny Walker',
        email: 'jonnywalker@gmail.com',
        password: 'Pes!!#2345'
    }).expect(201)
})

test('should fail as no email provided', async () => {
    await request(app).post('/users').send({
        name: userOne.name, password: userOne.password
    }).expect(500)
})

test('should login with correct credentials', async () => {
    await request(app).post('/users/login')
        .send({
            email: userOne.email, password: userOne.password
        }).expect(200)
})

test('should fail with incorrect credentials', async () => {
    await request(app).post('/users/login')
        .send({
            email: userOne.email, password: 'pssword'
        }).expect(400)
})

test('should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

//update
test('Should update a profile', async () => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'John Doe',
            age: 23
        }).expect(200)
})

test('Should fail to update a profile as height property do not exist', async () => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            height: 37
        }).expect(404)
})

//logout
test('should fail as no authorization is provided', async () => {
    await request(app).post('/users/logout/1')
        .send().expect(401)
})

test('should logged out from the application', async () => {
    await request(app).post('/users/logout/1')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send().expect(200)
})
