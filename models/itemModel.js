const bcrypt = require("bcrypt");
const uuid = require("uuid");
const db = require('../services/database.js').config;
const {dirname} = require('path');
const mainDir = dirname(require.main.filename);

let deleteItem = (id) => new Promise((resolve, reject) => {
    db.query("DELETE FROM itemsCCL WHERE IID = "+parseInt(id), function (err, item, fields) {
        if (err) {
            reject(err)
        } else {
            resolve();
        }
    })
})

let getItems = () => new Promise((resolve, reject) => {
    db.query("SELECT * FROM itemsCCL", function (err, items, fields) {
        if (err) {
            reject(err)
        } else {
            resolve(items);
        }
    })
})

let getItem = (id) => new Promise((resolve, reject) => {
    db.query("SELECT * FROM itemsCCL WHERE IID =" +parseInt(id), function (err, item, fields) {
        if (err) {
            reject(err)
        } else {
            resolve(item[0]);
        }
    })
})

async function addItem(itemData, itemImage, userID) {
    itemData.userID = userID;
    itemData.transfer = itemData.transfer !== "pickup";
    let imageuuid = new Array(5);

    if(itemImage != null) {
        let images = itemImage.itemImage;
        if(images[0]) {
            for(let i = 0; i<images.length; i++) {
                imageuuid[i] = uuid.v4() + images[i].name;
                let uploadPath = mainDir + '/public/uploads/' + imageuuid[i];
                images[i].mv(uploadPath, function (err) {
                    if (err) return res.status(500).send(err);
                })
            }}
            else {
            imageuuid[0] = uuid.v4() + images.name;
            let uploadPath = mainDir + '/public/uploads/' + imageuuid[0];
            images.mv(uploadPath, function (err) {
                if (err) return res.status(500).send(err);
            })
            }
        }
    else {
        imageuuid[0] = 'example-item.png';
    }

    let sql = 'INSERT INTO itemsCCL (title, description, price, transfer, imageuuid1, imageuuid2, imageuuid3, imageuuid4, imageuuid5, userID) VALUES (' +
        db.escape(itemData.title) + "," +
        db.escape(itemData.description) + "," +
        db.escape(itemData.price) + "," +
        db.escape(itemData.transfer) + "," +
        db.escape(imageuuid[0]) + "," +
        db.escape(imageuuid[1]) + "," +
        db.escape(imageuuid[2]) + "," +
        db.escape(imageuuid[3]) + "," +
        db.escape(imageuuid[4]) + "," +
        db.escape(itemData.userID) + ")"
    ;

    await db.query(sql);
    console.log("Item added successfully");
}

module.exports = {
    getItems, addItem, getItem, deleteItem
}