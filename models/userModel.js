const db = require('../services/database.js').config;
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const userController = require('../controllers/userController');
const {dirname} = require('path');
const mainDir = dirname(require.main.filename);
const sharp = require('sharp');
const jwt = require("jsonwebtoken");
const {access_token_secret: ACCESS_TOKEN_SECRET} = require("../secrets");

let getUser = (id) => new Promise((resolve, reject) => {
    let sql = "SELECT * FROM usersCCL WHERE UID =" +parseInt(id);
    db.query(sql, function(err, user, fields) {
        if (err) {
            console.log("error");
            reject(err);
        }
        else {
            resolve(user[0]);
        }
    })
})

async function addUser(userData, image) {
    let pw = await bcrypt.hash(userData.password, 10);
    let sql;
    if(image != null) {
        let avatar = image.avatar;
        let imageuuid = uuid.v4() + avatar.name;
        let uploadPath = mainDir + '/public/uploads/' + imageuuid;
        console.log(uploadPath);

        avatar.mv(uploadPath, function (err) {
            if (err) return res.status(500).send(err);
        })

        sql = 'INSERT INTO usersCCL (email, username, password, firstname, lastname, country, city, streetaddress, phonenumber, imageuuid) VALUES (' +
            db.escape(userData.email) + "," +
            db.escape(userData.username) + "," +
            db.escape(pw) + "," +
            db.escape(userData.firstname) + "," +
            db.escape(userData.lastname) + "," +
            db.escape(userData.country) + "," +
            db.escape(userData.city) + "," +
            db.escape(userData.streetaddress) + "," +
            db.escape(userData.phonenumber) + "," +
            db.escape(imageuuid) + ")"
        ;
    }

    else {
        sql = 'INSERT INTO usersCCL (email, username, password, firstname, lastname, country, city, streetaddress, phonenumber) VALUES (' +
            db.escape(userData.email) + "," +
            db.escape(userData.username) + "," +
            db.escape(pw) + "," +
            db.escape(userData.firstname) + "," +
            db.escape(userData.lastname) + "," +
            db.escape(userData.country) + "," +
            db.escape(userData.city) + "," +
            db.escape(userData.streetaddress) + "," +
            db.escape(userData.phonenumber) + ")"
        ;
    }
    await db.query(sql);
    console.log("User added successfully");
}

let getUsers = () => new Promise((resolve, reject) => {
    db.query("SELECT * FROM usersCCL", function (err, users, fields) {
        if (err) {
            reject(err)
        } else {
            resolve(users);
        }
    })
})



let getItemsFromUser = (id) => new Promise((resolve, reject) => {
    let sql1 = "SELECT * FROM itemsCCL WHERE UserID =" +parseInt(id);

    db.query(sql1, function(err, items, fields) {
        if (err) {
            console.log("error");
            reject(err);
        }
        else {
            resolve(items);
        }
    })
})

let getUserOfItem = (id) => new Promise((resolve, reject) => {
    let sql1 = "SELECT * FROM itemsCCL WHERE IID =" +parseInt(id);

    db.query(sql1, function(err, item, fields) {
        if (err) {
            console.log("error");
            reject(err);
        }
        else {
            db.query("SELECT * FROM usersCCL WHERE UID =" +item[0].userID, function(err, user, fields) {
                if (err) {
                    console.log("error2");
                    reject(err);
                }
                else {
                    resolve(user[0]);
                }
            })
        }
    })
})

async function updateUser(req, res, userData) {
    let newPassword;
    let currentPassword;
    let comparedPassword;
    let sql;
    if (userData.oldPassword!=='') {
        await getUser(userData.UID)
            .then(user => currentPassword = user.password)

        await bcrypt.compare(userData.oldPassword, currentPassword, function(err, results) {
            if (err) {
                console.log("error compare");
                throw new Error(err);
            }
            if (results) {
                console.log("results compare");
                res.redirect(`/users/${userData.UID}`);
            }
            else {
                console.log("else compare");
                //res.render('editProfile', {user: req.user, message: "Wrong password"});
                res.render('editProfile', {user: req.user, message: "Wrong password"});
            }
        })
        newPassword = await bcrypt.hash(userData.password, 10);

        sql = "UPDATE usersCCL SET " +
            "email = " + db.escape(userData.email) +
            ", username = " + db.escape(userData.username) +
            ", password = " + db.escape(newPassword) +
            ", firstname = " + db.escape(userData.firstname) +
            ", lastname = " + db.escape(userData.lastname) +
            ", country = " + db.escape(userData.country) +
            ", city = " + db.escape(userData.city) +
            ", streetaddress = " + db.escape(userData.streetaddress) +
            ", phonenumber = " + db.escape(userData.phonenumber) +
            " WHERE UID = " + parseInt(userData.UID);
    }

    else {
        sql = "UPDATE usersCCL SET " +
            "email = " + db.escape(userData.email) +
            ", username = " + db.escape(userData.username) +
            ", firstname = " + db.escape(userData.firstname) +
            ", lastname = " + db.escape(userData.lastname) +
            ", country = " + db.escape(userData.country) +
            ", city = " + db.escape(userData.city) +
            ", streetaddress = " + db.escape(userData.streetaddress) +
            ", phonenumber = " + db.escape(userData.phonenumber) +
            " WHERE UID = " + parseInt(userData.UID);
    }
    console.log(sql);

    await db.query(sql, function (err, user, field) {
        if(err) {
            console.log('error');
        }
    })
}

    module.exports = {
    addUser, getUsers, updateUser, getUser, getItemsFromUser, getUserOfItem,
}