const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const userModel = require("../models/userModel");
const authenticationService = require('../services/authentication');
const itemController = require('../controllers/itemController')

router.use(authenticationService.loggedInUser);
router.use(itemController.getItems);
router.use(userController.getUsers);

router.route('/')
    .get((req, res) => {
        res.render('index', {user: req.user, items: req.items, users: req.users});
    });

router.route('/register')
    .get((req, res) => {
        res.render('register', {user: req.user});
    })
    .post((req, res, next) => {
        userController.addUser(req, res);
    });

router.route('/login')
    .get((req, res) => {
        res.render('login', {user: req.user, message: ""});
    })
    .post((req, res, next) => {
        userController.loginUser(req, res);
    });

router.get('/logout', (req, res) => {
    res.cookie('accessToken', '', {maxAge: 0});
    res.redirect('/')
})

module.exports = router;