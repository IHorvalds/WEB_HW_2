const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const title = require('../helpers/constants').appTitle;
const multer = require('multer');
var upload = multer();

router.route('/register')
.post(upload.none(), async (req, res) => {
    // console.log(req);
    // check name and email
    if (typeof req.body.name == 'undefined') {
        return res.json({"error": "Name can't be empty"});
    }

    if (typeof req.body.email == 'undefined') {
        return res.json({"error": "Email can't be empty"});
    }

    if (typeof req.body.password == 'undefined') {
        return res.json({"error": "Password can't be empty"});
    }

    // Is email already in use?
    try {
        const user = await User.findOne({"email": req.body.email}).exec();
        if (user) {
            return res.json({"error": "Email already in use"});
        }
    } finally {}
    

    // hash password
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(req.body.password, salt);
    
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashed
    });
    user.save()
    .then((savedUser) => {
        const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET);
        res.cookie('auth-token', token);
        return res.json(token);
    })
    .catch((error) => {
        console.log(error);
        return res.status(500).json({"message" : error});
    });
});

async function checkCredentials(body) {
    if (body.email && body.password) {
        const user = await User.findOne({"email": body.email}).exec();
        if (user) {
            const valid = await bcrypt.compare(body.password, user.password);
            if (valid) {
                return user;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

router.route('/login')
.get( (req, res) => {
    res.render('login', {title});
})
.post(upload.none(), async (req, res) => {
    const token = req.cookies['auth-token'];
    if (token) {
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            if (verified) {
                res.status(200).json({"user_id" : verified});
            } else {
                const validCreds = await checkCredentials(req.body);
                if (validCreds) {
                    const new_token = jwt.sign({_id: validCreds._id, name: validCreds.name}, process.env.TOKEN_SECRET);
                    res.cookie('auth-token', new_token);
                    res.json({"name": validCreds.name});
                } else {
                    res.status(400).json({"error": "Invalid credentials"});
                }
            }
        } catch {
            const validCreds = await checkCredentials(req.body);
            if (validCreds) {
                const new_token = jwt.sign({_id: validCreds._id, name: validCreds.name}, process.env.TOKEN_SECRET);
                res.cookie('auth-token', new_token);
                res.json({name: validCreds.name});
            } else {
                res.status(400).json({"error": "Invalid credentials"});
            }
        }
    } else {
        const validCreds = await checkCredentials(req.body);
        if (validCreds) {
            const new_token = jwt.sign({_id: validCreds._id, name: validCreds.name}, process.env.TOKEN_SECRET);
            res.cookie('auth-token', new_token);
            res.json({name: validCreds.name});
        } else {
            res.status(401).json({"error": "Invalid credentials"});
        }
    }
});

router.get('/logout', async (req, res) => {
    res.clearCookie('auth-token');
    res.redirect('/auth/login');
});

module.exports = router;