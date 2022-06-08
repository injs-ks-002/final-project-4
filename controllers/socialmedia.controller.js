const {User, SocialMedia} = require('../models/index')
const {validationResult} = require('express-validator')
const errorFormatter = ({ msg }) => {
    return `${msg}`;
}

exports.postSocialMedia = async (req, res) => {
    const {name, social_media_url} = req.body
    const errors = validationResult(req).formatWith(errorFormatter)

    await SocialMedia.create({
        UserId: req.id,
        name: name,
        social_media_url: social_media_url
    }).then(socialmedia => {
        if (!errors.isEmpty()) {
            return res.status(422).json({
                'status': 422,
                'message': errors.array().join(',')
            })
        } else {
            if (!socialmedia) {
                res.status(400).send({
                    status: "400",
                    message: "Failed for add social media to database"
                })
            }
            res.status(201).send({
                social_media: socialmedia
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
            res.status(503).send({
                status: "503",
                message: "Failed for load database"
            })
        }
    })
}

exports.getAllSocialMedia = async (req, res) => {
    const userId = req.id
    try {
        const dbSocialMedia = await SocialMedia.findAll({
            where: {
                UserId: userId
            },
            order: [
                ['updatedAt', 'DESC']
            ],
            include: {
                model: User,
                as: 'User'
            }
        })

        if (dbSocialMedia.length === 0) {
            res.status(404).send({
                status: "404",
                message: "Social media data is not found"
            })
        } else {
            res.status(200).send({
                social_media: dbSocialMedia
            })
        }
    } catch {
        res.status(503).send({
            status: "503",
            message: "Failed for load social media data"
        })
    }
}

exports.putSocialMedia = async (req, res) => {
    const {name, social_media_url} = req.body
    const userId = req.id
    const id = req.params.socialMediaId
    const errors = validationResult(req).formatWith(errorFormatter)
    try {
        const dbSocialMedia = await SocialMedia.findOne({
            where: {
                id: id,
                UserId: userId
            }
        })

        if (!errors.isEmpty()) {
            return res.status(422).json({
                'status': 422,
                'message': errors.array().join(',')
            })
        } else {
            if (!dbSocialMedia) {
                res.status(404).send({
                    status: '404',
                    message: `Social media by id '${id}' is not found`
                })
            } else {
                const updateSocialMedia = await SocialMedia.update({
                    name: name,
                    social_media_url: social_media_url
                }, {
                    where: {
                        id: id
                    }
                })
    
                if (!updateSocialMedia) {
                    res.status(400).send({
                        status: '400',
                        message: 'Failed for update social media data'
                    })
                    return
                }

                const dbSocialMedia = await SocialMedia.findOne({
                    where: {
                        id: id
                    }
                })
    
                res.status(200).send({
                    social_media: dbSocialMedia
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
                message: "Failed for load social media data"
            })
        }
    }
}

exports.deleteSocialMedia = async (req, res) => {
    const id = req.params.socialMediaId
    const userId = req.id
    try {
        const dbSocialMedia = await SocialMedia.destroy({
            where: {
                id: id,
                UserId: userId
            }
        })

        if (!dbSocialMedia) {
            res.status(400).send({
                status: '400',
                message: 'Failed for delete social media data'
            })
            return
        }

        res.status(200).send({
            message: 'Your social media has been succesfully deleted'
        })
    } catch {
        res.status(503).send({
            status: "503",
            message: "Failed for load social media data"
        })
    }
}