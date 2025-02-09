const express = require('express');
const app = express();
const port = 5000;
app.use(express.static('public'));

const path = require('path');
let ejs = require('ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const cors = require('cors');
app.use(cors());

const fileUpload = require('express-fileupload');
app.use(fileUpload({
    limits: {
        fileSize: 1000000 //1mb
    },
    abortOnLimit: true,
    responseOnLimit: 'Your uploaded picture is too big, please upload a picture with max. 1MB of size.',
    createParentPath: true,
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const itemsRouter = require('./routes/items');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/items', itemsRouter);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});