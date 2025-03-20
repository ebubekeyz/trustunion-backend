const express = require('express');
const router = express.Router();

const upload = require('../controllers/uploadImageController');

router.route('/').post(upload);

module.exports = router;
