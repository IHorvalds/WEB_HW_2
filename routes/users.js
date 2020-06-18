const router = require('express').Router();

const multer = require('multer');
const fs = require('fs');

const User = require('../model/User');
const Camera = require('../model/Camera');
const Photo = require('../model/Photo');
const title = require('../helpers/constants').appTitle;

var upload = multer();

router.route('/:userid/messages')
.get( async (request, response) => {

}).post( async (request, response) => {

}).patch( async (request, response) => {

}).delete( async (request, response) => {

});

router.route('/:userid')
.get( async (request, response) => {

}).post( async (request, response) => {

})
.patch( async (request, response) => {

})
.delete( async (request, response) => {

});

module.exports = router;