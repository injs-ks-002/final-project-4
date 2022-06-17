const request = require('supertest')
const app = require('../app-test')
const { sequelize } = require('../models')
var jwt = require('jsonwebtoken');
let privateKey = 'helloworld'

const user = {
    "email": "info@info.com",
    "password": "admin123"
}

var user_id = ''
var photoId = ''
const id_not_found = 0
var token = ''

const photoData = {
    title: "foto wisuda",
    caption: "foto kenangan bersama",
    poster_image_url: 'https://github.com/',
    user_id: user_id,
}

const failedData = {
    title: "foto wisuda",
    caption: "foto kenangan bersama",
    poster_image_url: 236482,
    user_id: "a",
}

beforeAll(done => {
    request(app).post("/users/login")
        .send(user)
        .end((error, res) => {
            if (error) done(error)
            token = res.body.token
            jwt.verify(token, privateKey, (err, decoded) => {
                if (err) {
                    done(err)
                }
                user_id = decoded.id
            });
            done()
        })
})


describe('photos getAllPhotos', () => {
    it("should return 200 status code", (done) => {
        request(app).get("/photo")
            .set('auth', `${ token }`)
            .then(res => {
                expect(res.status).toEqual(200)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.comment).not.toEqual("number")
                expect(typeof res.body.comment).not.toEqual("boolean")
                expect(typeof res.body.comment).not.toEqual("string")
                done()
            }).catch(error => {
                done(error)
            })
    })
})

describe('photo postPhoto', () => {
    it("should return 201", (done) => {
        request(app)
            .post('/photo')
            .set('auth', `${token}`)
            .send(photoData)
            .then(res => {
                photoId = res.body.id
                expect(res.status).toEqual(201)
                expect(typeof res.body).toEqual("object")
                expect(res.body.title).toEqual(photoData.title)
                expect(res.body.poster_image_url).toEqual(photoData.poster_image_url)
                expect(res.body.caption).toEqual(photoData.caption)
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it("should return 400 status code", (done) => {
        request(app).post("/photo")
            .set('auth', `${ token }`)
            .send(failedData)
            .then(res => {
                expect(res.status).toEqual(400)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.message).toEqual("string")
                expect(typeof res.body.message).not.toEqual("number")
                expect(typeof res.status).toEqual("number")
                done()
            }).catch(error => {
                done(error)
            })
    })
})

describe('photo updatePhoto', () => {
    it("should return 200 status code", (done) => {
        request(app).put(`/photo/${photoId}`)
            .set('auth', `${ token }`)
            .send(photoData)
            .then(res => {
                expect(res.status).toEqual(200)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.photo).toEqual("object")
                expect(typeof res.body.photos).not.toEqual("number")
                expect(typeof res.status).toEqual("number")
                done()
            }).catch(error => {
                done(error)
            })
    })

    it("should return 422 status code", (done) => {
        request(app).put(`/photo/${photoId}`)
            .set('auth', `${ token }`)
            .send(failedData)
            .then(res => {
                expect(res.status).toEqual(422)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.message).not.toEqual("boolean")
                expect(typeof res.body.message).not.toEqual("object")
                expect(typeof res.status).toEqual("number")
                done()
            }).catch(error => {
                done(error)
            })
    })

})


describe('Photo deletephoto', () => {
    it("should return 200 status code", (done) => {
        request(app).delete(`/photo/${photoId}`)
            .set('auth', `${ token }`)
            .then(res => {
                expect(res.status).toEqual(200)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.message).toEqual("string")
                expect(res.body.message).toEqual("Your Photo has been succesfully deleted")
                expect(typeof res.status).toEqual("number")
                done()
            }).catch(error => {
                done(error)
            })
    })

    it("should return 400 status code", (done) => {
        request(app).delete(`/photo/${id_not_found}`)
            .set('auth', `${ token }`)
            .then(res => {
                expect(res.status).toEqual(400)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.message).toEqual("string")
                expect(typeof res.body.message).not.toEqual("number")
                expect(typeof res.status).toEqual("number")
                done()
            }).catch(error => {
                done(error)
            })
    })

    it("should return 500 status code", (done) => {
        request(app).delete(`/photo/abcdef`)
            .set('auth', `${ token }`)
            .then(res => {
                expect(res.status).toEqual(500)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.message).toEqual("string")
                expect(typeof res.body.message).not.toEqual("number")
                expect(typeof res.status).toEqual("number")
                done()
            }).catch(error => {
                done(error)
            })
    })
 })

