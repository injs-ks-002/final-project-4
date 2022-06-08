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
var commentId = ''

const commentData = {
    UserId: userId,
    PhotoId: 1,
    comment: "test comment with supertest"
}

const commentDataFailed = {
    UserId: 'a',
    PhotoId: 'a',
    comment: 1
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

describe('POST /comments',  () => {
    it('should send response with 201 status code', (done) => {

        request(app)
            .post('/comments')
            .set('auth', `${token}`)
            .send(commentData)
            .then(res => {
                commentId = res.body.comment.id
                expect(res.status).toEqual(201)
                expect(typeof res.body).toEqual("object")
                expect(res.body.comment.PhotoId).toEqual(commentData.PhotoId)
                expect(typeof res.body.comment.UserId).toEqual("number")
                expect(res.body.comment.comment).toEqual(commentData.comment)
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it('should send response with 422 status code', (done) => {
        request(app)
            .post('/comments')
            .set('auth', `${token}`)
            .send(commentDataFailed)
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

describe('GET /comments', () => {
    it('should send response with 200 status code', (done) => {
        request(app)
            .get('/comments')
            .set('auth', `${token}`)
            .then(res => {
                expect(res.status).toEqual(200)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.comment).not.toEqual("number")
                expect(typeof res.body.comment).not.toEqual("string")
                expect(typeof res.body.comment).not.toEqual("boolean")
                done()
            })
            .catch(err => {
                done(err)
            })
    })
})

describe('PUT /comments/:commentId',  () => {
    it('should send response with 200 status code', (done) => {

        request(app)
            .put(`/comments/${commentId}`)
            .set('auth', `${token}`)
            .send(commentData)
            .then(res => {
                expect(res.status).toEqual(200)
                expect(typeof res.body).toEqual("object")
                expect(res.body.comment.PhotoId).toEqual(commentData.PhotoId)
                expect(typeof res.body.comment.UserId).toEqual("number")
                expect(res.body.comment.comment).toEqual(commentData.comment)
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it('should send response with 422 status code', (done) => {
        request(app)
            .put(`/comments/${commentId}`)
            .set('auth', `${token}`)
            .send(commentDataFailed)
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

describe('DELETE /comments/:commentId',  () => {
    it('should send response with 200 status code', (done) => {

        request(app)
            .delete(`/comments/${commentId}`)
            .set('auth', `${token}`)
            .then(res => {
                expect(res.status).toEqual(200)
                expect(typeof res.body).toEqual("object")
                expect(typeof res.body.message).toEqual("string")
                expect(res.body.message).toEqual('Your comment has been succesfully deleted')
                expect(typeof res.body.message).not.toEqual("number")
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it('should send response with 400 status code', (done) => {
        request(app)
            .delete('/comments/1000')
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
    sequelize.queryInterface.bulkDelete('Comment', null, {
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