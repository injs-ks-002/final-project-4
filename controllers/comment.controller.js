const { Photo, User, Comment } = require('../models/index')
const { validationResult } = require('express-validator')
const errorFormatter = ({ msg }) => {
    return `${msg}`;
}

exports.postComment = async (req, res) => {
    const body = req.body
    const errors = validationResult(req).formatWith(errorFormatter)

    await Comment.create({
        UserId: req.id,
        PhotoId: body.PhotoId,
        comment: body.comment
    }).then(comments => {
        if (!errors.isEmpty()) {
            return res.status(422).json({
                'status': 422,
                'message': errors.array().join(',')
            })
        } else {
            res.status(201).send({
                comment: comments
            })
        }
    }).catch(err => {
        if (!errors.isEmpty()) {
            return res.status(422).json({
                'status': 422,
                'message': errors.array().join(',')
            })
        } else {
            console.log(err)
            res.status(400).send({
                status: "400",
                message: "Failed for add comment to database"
            })
        }
    })
}

exports.getAllComment = async (req, res) => {
    await Comment.findAll({
        order: [
            ['updatedAt', 'DESC']
        ],
        include: [{
            model: Photo,
            as: 'Photo'
        }, {
            model: User,
            as: 'User'
        }]
    }).then(comment => {
        if (comment.length === 0) {
            res.status(404).send({
                status: '404',
                message: 'Comment data is not found'
            })
        } else {
            res.status(200).send({
                comments: comment
            })
        }
    }).catch(err => {
        console.log(err)
        res.status(503).send({
            status: "503",
            message: "Failed for load comment data"
        })
    })
}

exports.putComment = async (req, res) => {
    const {
        comment
    } = req.body
    const userId = req.id
    const id = req.params.commentId
    const errors = validationResult(req).formatWith(errorFormatter)
    try {
        const dbComment = await Comment.findOne({
            where: {
                id: id,
                UserId: userId
            }
        })

        if (!dbComment) {
            res.status(404).send({
                status: '404',
                message: `Comment by id '${id}' is not found`
            })
        } else {
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    'status': 422,
                    'message': errors.array().join(',')
                })
            } else {
                const updateComment = await Comment.update({
                    comment: comment
                }, {
                    where: {
                        id: id
                    }
                })
    
                if (!updateComment) {
                    res.status(400).send({
                        status: '400',
                        message: 'Failed for update comment data'
                    })
                    return
                }

                const dbComment = await Comment.findOne({
                    where: {
                        id: id
                    }
                })
    
                res.status(200).send({
                    comment: dbComment
                })
            }
        }
    } catch {
        if (!errors.isEmpty()) {
            return res.status(422).json({
                'status': 422,
                'message': errors.array().join(',')
            })
        } else {
            res.status(503).send({
                status: "503",
                message: "Failed for load comment data"
            })
        }
    }
}

exports.deleteComment = async (req, res) => {
    const id = req.params.commentId
    const userId = req.id
    try {
        const dbComment = await Comment.destroy({
            where: {
                id: id,
                UserId: userId
            }
        })

        if (!dbComment) {
            res.status(400).send({
                status: '400',
                message: 'Failed for delete comment data'
            })
            return
        }

        res.status(200).send({
            message: 'Your comment has been succesfully deleted'
        })
    } catch {
        res.status(503).send({
            status: "503",
            message: "Failed for load comment data"
        })
    }
}