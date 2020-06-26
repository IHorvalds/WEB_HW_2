const router = require('express').Router();
const title = require('../helpers/constants').appTitle;
const verifyToken = require('../helpers/verifyToken');
const multer = require('multer');
const Message = require('../model/Message');
const User = require('../model/User');

var upload = multer();

router.route('/').get(verifyToken, async (req, res) => {
    let page = 'messages';
    var data = {};
    data.user = req.user;
    Message.find().sort([['add_date', -1]]).populate('owner').exec()
    .then( messages => {
        
        data.messages = messages;
        res.render('index', {title, page, data});
    })
    .catch( err => {
        res.status(500).render('error500');
    })
}).post(upload.none(), verifyToken, async (req, res) => {
    if (req.user) {
        const message = Message({
            owner: req.user,
            title: req.body.title,
            content: req.body.content,
            state: req.body.mood
        });

        message.save()
        .then( () => {
            res.status(200).send('Success');
        })
        .catch( () => {
            res.status(500).render('error500');
        });
    } else {
        res.status(401);
    }
});

router.route('/:username').get(verifyToken, async (req, res) => {
    let page = 'messages';
    var data = {};
    data.user = req.user;
    const user = await User.findOne({username: req.params.username}).exec();
    if (user) {
        Message.find({owner: user}).populate('owner').exec()
        .then( messages => {
            data.username_from_url = req.params.username;
            data.messages = messages;
            res.render('index', {title, page, data});
        })
        .catch( err => {
            res.status(500).render('error500');
        })
    } else {
        res.redirect(303, '/messages');
    }
});

router.route('/:messageid').delete(verifyToken, async (req, res) => {
    if (req.user) {
        Message.deleteOne({_id: req.params.messageid, owner: req.user}).exec()
        .then( message => {
            if (message)
                res.status(200).send("Success");
            else
                res.status(404).send("Message not found");
        })
        .catch( err => {
            res.status(500).json({'error': err});
        })
    } else {
        res.status(401);
    }
});

module.exports = router;