const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = require('../secrets').access_token_secret;
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

function authenticateUser({email, password}, users, req, res) {
    const user = users.find(u => {
        return u.email === email;
    });

    bcrypt.compare(password, user.password, function (err, results) {
        if (err) {
            throw new Error(err);
        }
        if (results) {
            const accessToken = jwt.sign({UID: user.UID, firstname: user.firstname}, ACCESS_TOKEN_SECRET);
            res.cookie('accessToken', accessToken);
            res.redirect('/');
        } else {
            res.render('login', {user: req.user, message: "Wrong email or password"});
        }
    })
}

function loggedInUser(req, res, next) {
    const token = req.cookies['accessToken'];
    if (token) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            userModel.getUser(user.UID)
                .then(user => {
                    req.user = user;
                    next();
                })
                .catch(err => res.sendStatus(500));
        });
    }
    else {
        next();
    }
}

module.exports = {
    authenticateUser,
    loggedInUser,
}