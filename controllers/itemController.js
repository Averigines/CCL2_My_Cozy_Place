const itemModel = require('../models/itemModel');
const userModel = require("../models/userModel");

function getItems(req, res, next) {
    itemModel.getItems()
        .then(items => {
            req.items = items;
            next();
        })
        .catch(err => res.sendStatus(500));
}

function getItemWithUser(req, res, next) {
    itemModel.getItem(req.params.id)
        .then(item => {
            userModel.getUserOfItem(req.params.id)
                .then(currentUser => {
                    res.render('item', {item, currentUser, user: req.user, itemJSON: JSON.stringify(item)})
                })
                .catch(err => res.sendStatus(500))
        })
        .catch(err => res.sendStatus(500))
}

async function addItem(req, res, next) {

    await itemModel.addItem(req.body, req.files, req.params.id);
    res.redirect(`/users/${req.params.id}`);
}

function deleteItem(req, res, next) {
    userModel.getUserOfItem(req.params.id)
        .then(user => {
            itemModel.deleteItem(req.params.id)
                .then(() => {
                    res.redirect(`/users/${user.UID}`);
                })
        })

}

module.exports = {
    getItems, addItem, getItemWithUser, deleteItem
}