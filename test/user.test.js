const request = require('supertest')
const app = require('../app-test')
const { sequelize } = require('../models')
var jwt = require('jsonwebtoken');
let privateKey = 'helloworld'

const userData = {
    "email": "riyad@gmail.com",
    "password": "ahmad"
}

const userDataFailed = {
    "email": "ahmad@gmail.com",
    "password": "ahmad"
}

const userDataFailedlogin = {
    "email": "admingmail.com",
    "password": 124
}

var userId = ''
const id_not_found = 0
var token = ''

const dataRegistrasiFailed = {
    full_name: "ahmad",
    email: "riyadgmail.com",
    username: 234345,
    password: "riyad",
    profile_image_url: "https://github.com/",
    age: 20,
    phone_number: 3234534
}

const updateUser = {
    full_name: "ahmadriyad",
    email: "ahmadriyad@gmail.com",
    username: "ahmad",
    profile_image_url: "https://github.com/",
    age: 20,
    phone_number: 3234534
}

const dataRegistrasiNewUser = {
    full_name: "ahmad",
    email: "riyad@gmail.com",
    username: "ahmad",
    password: "ahmad",
    profile_image_url: "https://github.com/",
    age: 20,
    phone_number: 3234534
}

describe('User register', () => {
    it("should return 201", (done) => {
        request(app).post("/users/register")
            .send(dataRegistrasiNewUser)
            .then(res => {
                expect(res.status).toEqual(201)
                expect(typeof res.body).toEqual("object")
                expect(res.body.phone_number).toEqual(dataRegistrasiNewUser.phone_number)
                expect(res.body.age).toEqual(dataRegistrasiNewUser.age)
                expect(res.body.username).toEqual(dataRegistrasiNewUser.username)
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it("should return 400", (done) => {
        request(app)
            .post('/users/register')
            .send(dataRegistrasiNewUser)
            .then(res => {
                expect(res.status).toEqual(400)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.message).toEqual("string")
                expect(typeof res.body.message).toEqual("string")
                expect(typeof res.status).toEqual("number")
                done()
            })
            .catch(err => {
                done(err)
            })
    })
})



describe('User loginUser', () => {
    it("should return 200", (done) => {
        request(app).post("/users/login")
            .send(userData)
            .then(res => {
                userId = res.body.id
                console.log(userId)
                token = res.body.token
                jwt.verify(token, privateKey, (err, decoded)=> {
                    userId = decoded.id
                });
                expect(res.status).toEqual(200)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.token).toEqual("string")
                expect(typeof res.body.token).not.toEqual("object")
                expect(typeof res.status).toEqual("number")
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it("should return 400", (done) => {
        request(app).post("/users/login")
            .send(userDataFailed)
            .then(res => {
                expect(res.status).toEqual(400)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body).not.toEqual("string")
                expect(typeof res.body).not.toEqual("text")
                expect(typeof res.status).toEqual("number")
                done()
            })
            .catch(err => {
                done(err)
            })
    })
 })


describe('User updateUser', () => {
    it("should return 200", (done) => {
        request(app).put(`/users/${userId}`)
            .set('auth', `${token}`)
            .send(updateUser)
            .then(res => {
                expect(res.status).toEqual(200)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.user.username).toEqual("string")
                expect(typeof res.body.user.full_name).toEqual("string")
                expect(typeof res.body.user.age).toEqual("number")
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it("should return 400", (done) => {
        request(app).put(`/users/${id_not_found}`)
            .set('auth', `${token}`)
            .send(updateUser)
            .then(res => {
                expect(res.status).toEqual(400)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.message).toEqual("string")
                expect(typeof res.body.message).toEqual("string")
                expect(typeof res.status).toEqual("number")
                done()
            })
            .catch(err => {
                done(err)
            })
    })

  })


describe('User deleteUser', () => {
    it("should return 200", (done) => {
        request(app).delete(`/users/${userId}`)
            .set('auth', `${token}`)
            .then(res => {
                userId = res.body.id
                console.log(userId)
                expect(res.status).toEqual(200)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.message).toEqual("string")
                expect(res.body.message).toEqual('Your User has been succesfully deleted')
                expect(typeof res.body.message).not.toEqual("number")
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it("should return 400", (done) => {
        request(app).delete(`/users/${id_not_found}`)
            .set('auth', `${token}`)
            .then(res => {
                userId = res.body.id
                console.log(userId)
                token = res.body.token
                expect(res.status).toEqual(400)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.message).toEqual("string")
                expect(typeof res.body.status).toEqual("string")
                expect(res.body.status).toEqual('400')
                done()
            })
            .catch(err => {
                done(err)
            })
    })


 })


