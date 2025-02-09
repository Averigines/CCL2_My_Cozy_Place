const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const itemController = require('../controllers/itemController');
const authenticationService = require('../services/authentication');

router.get('/:id', userController.getUserWithItems);

router.route('/:id/new_item')
    .get((req, res) => {
        res.render('new_item', {user: req.user});
    })
    .post((req, res) => {
        itemController.addItem(req, res);
    })

router.get('/:id/editProfile', (req, res) => {
    res.render('editProfile', {user: req.user, message: ''});
})

router.post('/:id/editProfile', userController.updateUser);


module.exports = router;