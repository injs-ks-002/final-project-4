const User = require("../models/index").User;
const bcrypt = require('bcrypt')
const { generateToken } = require ('../middleware/auth.js');
const {validationResult} = require('express-validator')

exports.getUser = async (req, res) => {
    return User.findAll().then(users=> {
        res.status(200).send({
            status : "SUCCES",
            data: users
        })
    }).catch(e => {
        console.log(e)
        res.status(500).send({
            status : "FAIL",
            message : 'INTERNAL SERVER ERROR'
        })
    })
}
exports.signUp = async(req, res) => {
    const body = req.body;
    const full_name = body.full_name;
    const email = body.email;
    const username = body.username;
    const password = body.password;
    const profile_image_url = body.profile_image_url;
    const age = body.age;
    const phone_number = body.phone_number;

    return User.findOne({
        where: {
        username : username,
        email: email,

        },
    }).then((user) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                "errors": errors.array()
            })
        }
       else{
        if (user) {
            return res.status(400).send({
                message: "Email already Exist",
            });
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        
        return User.create({
                full_name : full_name,
                email: email,
                username : username,
                password: hash,
                profile_image_url : profile_image_url,
                age : age,
                phone_number : phone_number,
            })
            .then(() => {
                User.findOne({
                    where : { email: email}
                }).then(user =>{
                    user = {
                        id : user.id,
                        email : user.email,
                        full_name : user.full_name,
                        username : user.username,
                        profile_image_url: user.profile_image_url,
                        age : user.age,
                        phone_number : user.phone_number
                        
                    }
                    res.status(201).json(user)
                })
                    
            })
            .catch((e) => {
                console.log(e);
                res.status(500).send({
                    message : "INTERNAL SERVER ERORR"
                });
            });
       }
    })
    .catch(err => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                "errors": errors.array()
            })
        } else {
            console.log(err)
            res.status(400).send({
                status: "400",
                message: "Failed for add comment to database"
            })
        }
    })
};

exports.signIn = async(req, res) => {
    const body = req.body;
    const email = body.email;
    const password = body.password;

    return User.findOne({
            where: {
                email: email,
            },
        })
        .then(user => {
            if (!user) {
                return res.status(400).send({
                    message: "Email Not Found please Sign UP",
                });
            }

            const isValid = bcrypt.compareSync(password, user.password);
            if (!isValid) {
                return res.status(400).send({
                    message: "email and password not match",
                });
            }
            const token = generateToken({
                id: user.id,
                full_name: user.full_name,
                email: user.email,
            });
            res.status(200).send({
                token: token,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({
                status : "FAIL",
                message : "Gagal login"
        });
});
}

exports.updateUser = async (req, res) => {
    var id = req.params.userId;
    id = req.id
    const full_name = req.body.full_name;
    const email = req.body.email;
    const username = req.body.username;
    const profile_image_url = req.body.profile_image_url;
    const age = req.body.age;
    const phone_number = req.body.phone_number;
    const dataUser = {
        full_name,
        email,
        username,
        profile_image_url,
        age,
        phone_number,
    };
    const errors = validationResult(req)
      await User.update(dataUser,
          { where: { id: id },
          returning : true,
        })
        .then((user) => {
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    "errors": errors.array()
                })
            } else {
                if (req.params.userId != id) {
                    res.status(400).send({
                        status: '400',
                        message: 'Failed for update photo data'
                    })
                    return
                } else {
                    res.status(200).json({
                        user: dataUser
                    })
                }
            }
        })
        .catch((error) => {
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    "errors": errors.array()
                })
            } else {
                console.log(error);
                res.status(500).json({
                    message: "INTERNAL SERVER",
                    error: error,
                });
            }
        })
}
exports.deleteUser = (req, res) => {
    var id = req.params.userId;
    id = req.id
    User.destroy({
      where: {  id: id },
    })
    .then (() => {
        if (req.params.userId != id) {
            res.status(400).send({
                status: '400',
                message: 'Failed for update photo data'
            })
            return
        }
        res.status(200).json({
            message: "Your User has been succesfully deleted",
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