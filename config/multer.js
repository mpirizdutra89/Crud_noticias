const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/img/noticia'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const nombre = Date.now() + ext;
        cb(null, nombre);
    }
});

const upload = multer({ storage });

module.exports = upload;