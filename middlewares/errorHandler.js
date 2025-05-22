// Middleware para manejar rutas no existentes (404)
const notFound = (req, res, next) => {
    res.status(404).render('404', { url: req.originalUrl });
};

// Middleware para errores generales (500)
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
};

module.exports = {
    notFound,
    errorHandler
};