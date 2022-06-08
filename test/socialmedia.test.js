const request = require('supertest')
const app = require('../app-test')
const { sequelize } = require('../models')
var jwt = require('jsonwebtoken');
let privateKey = 'helloworld'

const userData = {
    email: "info@info.com",
    password: "admin123"
}
var token = ''
var userId = ''
var socialMediaId = ''

const socialMediaData = {
    UserId: userId,
    name: 'Test',
    social_media_url: 'https://github.com/'
}

const socialMediaDataFailed = {
    UserId: 'a',
    name: 1,
    social_media_url: 1
}

beforeAll((done) => {
    request(app).post('/users/login')
        .send(userData)
        .end((err, res) => {
            if (err) {
                done(err)
            }
            token = res.body.token
            jwt.verify(token, privateKey, (err, decoded)=> {
                if(err) {
                    done(err)
                }
                userId = decoded.id
            });
            done()
        })
});

describe('POST /socialmedias',  () => {
    it('should send response with 201 status code', (done) => {

        request(app)
            .post('/socialmedias')
            .set('auth', `${token}`)
            .send(socialMediaData)
            .then(res => {
                socialMediaId = res.body.social_media.id
                expect(res.status).toEqual(201)
                expect(typeof res.body).toEqual("object")
                expect(res.body.social_media.social_media_url).toEqual(socialMediaData.social_media_url)
                expect(typeof res.body.social_media.UserId).toEqual("number")
                expect(res.body.social_media.name).toEqual(socialMediaData.name)
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it('should send response with 422 status code', (done) => {
        request(app)
            .post('/socialmedias')
            .set('auth', `${token}`)
            .send(socialMediaDataFailed)
            .then(res => {
                expect(res.status).toEqual(422)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.message).toEqual("string")
                expect(typeof res.body.status).toEqual("number")
                expect(res.body.status).toEqual(422)
                done()
            })
            .catch(err => {
                done(err)
            })
    })
})

describe('GET /socialmedias', () => {
    it('should send response with 200 status code', (done) => {
        request(app)
            .get('/socialmedias')
            .set('auth', `${token}`)
            .then(res => {
                expect(res.status).toEqual(200)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.social_media).not.toEqual("number")
                expect(typeof res.body.social_media).not.toEqual("string")
                expect(typeof res.body.social_media).not.toEqual("boolean")
                done()
            })
            .catch(err => {
                done(err)
            })
    })
})

describe('PUT /socialmedias/:socialMediaId',  () => {
    it('should send response with 200 status code', (done) => {

        request(app)
            .put(`/socialmedias/${socialMediaId}`)
            .set('auth', `${token}`)
            .send(socialMediaData)
            .then(res => {
                expect(res.status).toEqual(200)
                expect(typeof res.body).toEqual("object")
                expect(res.body.social_media.social_media_url).toEqual(socialMediaData.social_media_url)
                expect(typeof res.body.social_media.UserId).toEqual("number")
                expect(res.body.social_media.name).toEqual(socialMediaData.name)
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it('should send response with 422 status code', (done) => {
        request(app)
            .put(`/socialmedias/${socialMediaId}`)
            .set('auth', `${token}`)
            .send(socialMediaDataFailed)
            .then(res => {
                expect(res.status).toEqual(422)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.message).toEqual("string")
                expect(typeof res.body.status).toEqual("number")
                expect(res.body.status).toEqual(422)
                done()
            })
            .catch(err => {
                done(err)
            })
    })
})

describe('DELETE /socialmedias/:socialMediaId',  () => {
    it('should send response with 200 status code', (done) => {

        request(app)
            .delete(`/socialmedias/${socialMediaId}`)
            .set('auth', `${token}`)
            .then(res => {
                expect(res.status).toEqual(200)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.message).toEqual("string")
                expect(res.body.message).toEqual('Your social media has been succesfully deleted')
                expect(typeof res.body.message).not.toEqual("number")
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it('should send response with 400 status code', (done) => {
        request(app)
            .delete('/socialmedias/1000')
            .set('auth', `${token}`)
            .then(res => {
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

afterAll((done) => {
    sequelize.queryInterface.bulkDelete('SocialMedia', null, {
        truncate: true,
        restartIdentity: true
    })
        .then(() => {
            return done()
        })
        .catch(err => {
            done(err)
        })
})