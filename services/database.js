const mysql = require('mysql');
const secrets = require('../secrets');

const config = mysql.createConnection({
    host: 'atp.fhstp.ac.at',
    port: 8007,
    user: 'cc211032',
    password: secrets.dbPassword,
    database: 'cc211032',
});

config.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = {config};