const userModel = require("../models/userModel");
const authenticationService = require("../services/authentication");
const itemModel = require("../models/itemModel");
const uuid = require('uuid');

function fileUpload(avatar, uuid) {
    let uploadPath = '/uploads/' + uuid;
        avatar.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
    })
}

async function addUser(req, res, next) {
    await userModel.addUser(req.body, req.files);
    res.redirect('/');
}

function loginUser(req, res, next) {
    userModel.getUsers()
        .then(users => {
            authenticationService.authenticateUser(req.body, users, req, res)
        })
        .catch(err => res.render('login', {user: req.user, message: "Wrong email or password"}))
}

function getUserWithItems(req, res, next) {
    userModel.getUser(req.params.id)
        .then((currentUser) => {
            userModel.getItemsFromUser(req.params.id)
                .then((items) => {
                    res.render('user', {currentUser, items, user: req.user})
            })
                .catch(err => res.sendStatus(500));
    })
        .catch(err => res.sendStatus(500));
}

function getUsers(req, res, next) {
    userModel.getUsers()
        .then(users => {
            req.users = users;
            next();
        })
        .catch(err => res.sendStatus(500));
}

async function updateUser(req, res, next) {
    console.log(req.body);
    console.log(req.params.id);
    await userModel.updateUser(req, res, req.body);
    res.redirect(`/users/${req.params.id}`);
}



module.exports = {
    addUser,
    loginUser,
    getUserWithItems,
    getUsers,
    fileUpload,
    updateUser,
}