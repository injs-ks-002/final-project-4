const {Photo, Comment, User} = require("../models/index");
const {validationResult} = require('express-validator')

exports.getPhoto = async (req, res) => {
    const userId = req.id
    return await Photo.findAll({
        where: {
            UserId: userId
        },
        include: [{
            model: User,
            as: 'User'
        }]
    }).then(photo=> {
        if (photo.length === 0) {
            res.status(404).send({
                status: '404',
                message: 'Photo data is not found'
            })
            return
        }
        res.status(200).send({
            status : "SUCCES",
            photos: photo
        })
    }).catch(e => {
        console.log(e)
        res.status(500).send({
            status : "FAIL",
            message : 'INTERNAL SERVER ERROR'
        })
    })
}

exports.postPhoto = async (req, res) => {
    const title = req.body.title;
    const caption = req.body.caption;
    const poster_image_url = req.body.poster_image_url;
    const userId = req.id;
    const errors = validationResult(req)

    await Photo.create({
        title: title,
        caption: caption,
        poster_image_url: poster_image_url,
        UserId : userId
    })
    .then((photo) => {
        if (!errors.isEmpty()) {
            return res.status(422).json(errors.array())
        } else {
            res.status(201).send({
                id: photo.id,
                title: photo.title,
                poster_image_url: photo.poster_image_url,
                caption: photo.caption,
                userId: photo.userId,
             })
        }
    }).catch((e) => {
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        } else {
            console.log(e)
            res.status(500).json({
                message : "INTERNAL SERVER ERROR",
                status: "500"
            })
        }
    })
}

exports.updatePhoto = async (req, res) => {
    const photoId = req.params.photoId;
    const title = req.body.title;
    const caption = req.body.caption;
    const poster_image_url = req.body.poster_image_url;
    const dataPhoto = {
        title,
        caption,
        poster_image_url,
    };
    const userId = req.id;
    const errors = validationResult(req)
    await Photo.update(dataPhoto, {
        where : { id: photoId, UserId: userId},
        returning: true,
    })
    .then((photos) => {
        if (!errors.isEmpty()) {
            return res.status(422).json(errors.array())
        } else {
            if (!photos) {
                res.status(400).send({
                    status: '400',
                    message: 'Failed for update photo data'
                })
                return
            }
            res.status(200).json({
                "photo": photos[1]
            })
        }
    })
    .catch((error) => {
        if (!errors.isEmpty()) {
            return res.status(422).json(errors.array())
        } else {
            console.log(error);
            res.status(503).json({
                message: "INTERNAL SERVER",
            });
        }
    })
}


exports.deletePhoto = async (req, res) => {
    const photoId = req.params.photoId;
    const userId = req.id;
    await Photo.destroy({
      where: {  id: photoId, UserId: userId},
    })
    .then (photo => {
        if (!photo) {
            res.status(400).send({
                status: '400',
                message: 'Failed for delete photo data'
            })
            return
        }
        res.status(200).json({
            message: "Your Photo has been succesfully deleted",
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            message: "INTERNAL SERVER",
            error: error,
        });
    })
}