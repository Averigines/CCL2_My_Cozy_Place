const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const itemController = require('../controllers/itemController');

router.get('/:id', itemController.getItemWithUser);

router.get('/:id/deleteItem', itemController.deleteItem);

module.exports = router;