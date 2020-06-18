const router = require('express').Router();

const multer = require('multer');
const fs = require('fs');
const path = require('path');

// const User = require('../model/User');
const Camera = require('../model/Camera');
// const Photo = require('../model/Photo');
const title = require('../helpers/constants').appTitle;

const verifyToken = require('../helpers/verifyToken');

var upload = multer();

router.route('/new').get( async (request, response) => {
    const page = 'camera_add';
    const data = [];
    response.render('index', {title, page, data});
}).post(upload.single('photo'), verifyToken, (request, response) => {
    if (request.body != undefined && request.file != undefined) {
        const camera = new Camera({
            owner: request.user._id,
            name: request.body.name,
            photos: [],
            is_digital: request.body.is_digital || true,
            description: request.body.description
        });
        camera.file = `/data/${request.user._id}/${camera._id}.jpg`;
        camera.save()
        .then((savedCamera) => {
            let dir = path.join(__dirname, `../data/${request.user._id}/`);
            console.log(path.join(dir, `${savedCamera._id}.jpg`));
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            fs.writeFileSync(path.join(dir, `${savedCamera._id}.jpg`), request.file.buffer, 'binary');
            response.redirect(`/cameras`);
        })
        .catch((err) => {
            response.redirect(`/cameras`);
        });
    }
});

router.route('/:camid').get( verifyToken, async (request, response) => {
    const camid = request.params.camid;
    const page = 'camera_detail';
    // const data = cameras[camid];
    if (request.user) {
        Camera.findOne({"_id": camid, "owner": request.user}).exec()
        .then((data) => {
            if (data)
                response.render('index', {title, page, data, camid});
            else
                response.render('error404');
        })
        .catch((err) => {
            response.status(404).render('error404');
        });    
    } else {
        response.redirect('/auth/login');
    }
}).post(upload.none(), verifyToken, async (request, response) => {
    if (request.body.description != undefined && request.user) {
        const camid = request.params.camid;
        const page = 'camera_detail';

        const data = {};
        if (request.body.name != undefined) {
            data.name = request.body.name;
        }

        if (request.body.description != undefined) {
            data.description = request.body.description;
        }

        Camera.updateOne({_id: camid, owner: request.user}, {$set, data}).exec()
        .then((updatedCamera) => {
            response.render('index', {title, page, data, camid});
        })
        .catch((err) => {
            response.status(500).render('error500');
        });

        
    } else {
        if (request.user)
            response.redirect('/cameras');
        else
            response.redirect('/auth/login');
    }
}).delete(verifyToken, async (request, response) => {
    const camid = request.params.camid;
    if (request.user) {
        Photo.deleteMany({camera: camid}).exec()
        .then( async () => {
            await Camera.deleteOne({_id: camid, owner: request.user}).exec();
            response.status(200).send("Success");
        })
        .catch( () => {
            response.status(500).render("error500");
        });    
    } else {
        response.redirect('/auth/login');
    }
});

router.route('/:camid/photos').get(verifyToken, async (request, response) => {
    const camid = request.params.camid;
    const page = 'photo_list';
    if (request.user) {
        Camera.find({_id: camid, owner: request.user}).populate("photos").exec()
        .then((data) => {
            // console.log([data]);
            response.render('index', {title, page, data});
        })
        .catch((err) => {
            // console.log(err);
            response.status(500).render('error500');
        });    
    } else {
        response.redirect('/auth/login');
    }
    
})

router.route('/').get(verifyToken, async (request, response) => {
    // const data = cameras;
    const page = 'camera_list';
    if (request.user) {
        Camera.find({owner: request.user}).select('_id name file photos').exec()
        .then((data) => {
            response.render('index', {title, page, data});
        })
        .catch((err) => {
            response.status(500).render('error500');
        });
    } else {
        response.redirect('/auth/login');
    }
    
});

module.exports = router;