const express = require('express')
const router = express.Router()
const upload = require('../config/multer');
const { nuevaNoticia, formularioNoticias, noticias } = require('../controllers/noticiasController')





router.get('/formulario', formularioNoticias)//vista del formulario
router.post('/nueva-noticia', upload.single('imagenDestacada'), nuevaNoticia)//ruta que resive los datos del formulario (nueva-noticia)
router.get('/', noticias)


module.exports = router