//Aca la idea es manejar rutas de la raiz ejemplo http://localhost:3000/   o http://localhost:3000/inicio o algo estatico que no tenga post,put,delet etc

exports.inicio = (req, res) => {
    res.render('inicio');
}