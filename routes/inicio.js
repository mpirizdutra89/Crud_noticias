const express = require('express')
const router = express.Router();
const { inicio } = require('../controllers/inicioController');


router.get(/^\/(inicio)?$/, inicio)
//aca puede aver otroas que sean de tipo raiz o estaticas que no nesesite un tratamiento  como usuarios

module.exports = router