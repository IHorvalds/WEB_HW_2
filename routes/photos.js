const router = require('express').Router();
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const User = require('../model/User');
const Camera = require('../model/Camera');
const Photo = require('../model/Photo');
const verifyToken = require('../helpers/verifyToken');

const title = require('../helpers/constants').appTitle;

var upload = multer();

router.route('/:camid/:id')
.get(verifyToken, async (request, response) => {
    const camid = request.params.camid;
    const id = request.params.id;
    const page = 'photo_detail';

    if (request.user) {
        Camera.findOne({_id: camid, owner: request.user}).exec()
        .then( camera => {
            if (camera.photos.includes(id)) {
                Photo.findById(id).exec()
                .then( photo => {
                    const cameraName = camera.name;
                    let model = photo;
                    model['cameraName'] = cameraName;
                    response.render('index', {title, page, data: model});
                })
                .catch( err => {
                    response.status(404).render('error404');
                });
            } else {
                response.status(404).render('error404');
            }
        })
        .catch( err => {
            response.status(404).render('error404');
        });    
    } else {
        response.redirect('/auth/login');
    }
    
})
.post(upload.none(), verifyToken, async (request, response) => {
    if (request.body != undefined) {
        const camid = request.params.camid;
        const id = request.params.id;

        if (request.user) {
            Camera.findOne({_id : camid, owner: request.user}).exec()
            .then( async camera => {
                if (camera.photos.includes(id)) {
                    let data = {};
                    if (request.body.title != undefined) {
                        data.title = request.body.title;
                    }
                    if (request.body.dateTaken != undefined) {
                        data.dateTaken = request.body.dateTaken;
                    }
                    if (request.body.description != undefined) {
                        data.description = request.body.description;
                    }
                    const update = await Photo.updateOne({_id: id}, {$set : data}).exec();
                    response.json(update);
                } else {
                    response.status(404).json({"error": "Photo not found"});
                }
            })
            .catch( err => {
                response.status(404).json({"error": "Camera not found"});
            });    
        } else {
            response.redirect('/auth/login');
        }

    } else {
        response.redirect('/photos')
    }
})
.delete(verifyToken, async (request, response) => {
    const camid = request.params.camid;
    const id = request.params.id;
    if (request.user) {
        Camera.findOne({_id: camid, owner: request.user}).exec()
        .then( async camera => {
            if (camera.photos.includes(id)) {
                camera.photos.splice(camera.photos.indexOf(id), 1);
                await Photo.deleteOne({_id: id}).exec();
                response.status(200).send("Success");
            } else {
                response.status(404).json({"error": "Photo not found"});
            }
        })
        .catch( err => {
            response.status(404).json({"error": "Camera not found"});
        });    
    } else {
        response.redirect('/auth/login');
    }
});

router.route('/new')
.get(verifyToken, async (request, response) => {
    const page = 'photo_add';
    if (request.user) {
        Camera.find({owner: request.user}).select('name file').exec()
        .then((data) => {
            response.render('index', {title, page, data});
        })
        .catch(() => {
            const data = []
            response.render('index', {title, page, data});
        });
    } else {
        response.redirect('/auth/login');
    }

})
.post(upload.single('photo'), verifyToken, async (request, response) => {
    if (request.body != undefined && request.file != undefined && request.user) {

        const photo = new Photo({
            title: request.body.title,
            file: `/data/${request.user._id}/${request.body.camera || "unknown"}/${request.file.originalname}`,
            dateTaken: request.body.dateTaken,
            iso: request.body.iso,
            description: request.body.description,
            film: request.body.filmName
        });

        photo.save()
        .then( async (savedPhoto) => {

            Camera.findOne({_id: request.body.camera, owner: request.user}).exec()
            .then( camera => {
                camera.photos.push(savedPhoto);
                // console.log(camera);
                camera.save();
                let dir = path.join(__dirname, `../data/${request.user._id}/${request.body.camera || "unknown"}/`); 
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                console.log(path.join(dir, request.file.originalname));
                fs.writeFileSync(path.join(dir, request.file.originalname), request.file.buffer, 'binary');
                
                response.redirect(`/photos/${request.body.camera || "unknown"}/${savedPhoto._id}`);
            })
            .catch( async err => {
                await photo.delete();
            });
            
        })
        .catch((err) => {
            // console.log(err);
            response.status(500).render('error500');
        });
        
    } else {
        if (request.user) 
            response.redirect('/photos');
        else
            response.redirect('/auth/login');
    }
});

router.route('/')
.get(verifyToken, async (request, response) => {
    // const data = cameras;
    const page = 'photo_list';
    if (request.user != undefined) {
        Camera.find({owner: request.user}).populate('photos').exec() // i'm not doing pagination now...
        .then( (data) => {
            // console.log(data);
            response.render('index', {title, page, data});
        })
        .catch( (err) => {
            // console.log(err);
            response.status(500).render('error500')
        })
    } else {
        const data = [];
        response.redirect('/auth/login');
    }
    
});

module.exports = router;