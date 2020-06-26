const express = require('express');
const path = require('path');
// const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
const app = express();
const cookieParser = require('cookie-parser');


// Middlewares

// Connect to DB
dotenv.config();

mongoose.connect(
    process.env.DB_LOCAL_CREDS, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
        () => {
            console.log("Successfully connected to Mongo");
    }
);

// app.use(bodyParser.json());
app.use(cookieParser());

// Routes

// static & ejs
app.use('/static', express.static("static"));
app.use('/data', express.static("data"));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Authentication
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// photos
const photosRoutes = require('./routes/photos');
app.use('/photos', photosRoutes);

//cameras
const camerasRoutes = require('./routes/cameras');
app.use('/cameras', camerasRoutes);

//users
const userRoutes = require('./routes/users');
app.use('/user', userRoutes);

//messages
const messageRoutes = require('./routes/messages');
app.use('/messages', messageRoutes);


app.get('/', (_, res) => {
    res.redirect('/photos');
})

// app.route('/messages').get( (request, response) => {
//     const page = 'messages';
//     response.render('index', {title, page});
// });

app.use(function(request, response) {
    response.status(404);

    if (request.accepts('html')) {
        response.sendFile(path.join(__dirname, '/static/404.html'));
        return;
    }
    response.type('txt').send('Not found');
});

var server = app.listen(8000, 
    console.log("Server running at localhost:8000")
);