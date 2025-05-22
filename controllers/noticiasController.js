const { title } = require('process')

const fs = require('fs').promises
const path = require('path');
const pathNoticias = path.join(__dirname, '../archivos/noticias.json');
const pathCategoria = path.join(__dirname, '../archivos/categorias.json');

exports.formulario = (req, res) => {
    res.render('noticias_formulario')
}



//Resive formulario de nueva noticia
exports.nuevaNoticia = async (req, res) => {
    try {
        //podemos usar la libreria joi para validar (defines el formato del objeto y depues podes usar el metodo validate)
        // tiene que tener el mismo formato json de noticias en sl submit del script creamo el objeto antes de mandarlo
        const pathImg = '/img/noticia/'
        const archivo = await fs.readFile(pathNoticias, 'utf8')
        const json = JSON.parse(archivo)

        const ultimoId = json.noticias.length > 0
            ? Math.max(...json.noticias.map(n => n.id))
            : 0

        const formulario = {
            id: ultimoId + 1,
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            categoria: req.body.categoria,
            fecha: req.body.fecha,
            imagenDestacada: `${pathImg}${req.file.filename}`
        }

        json.noticias.push(formulario)

        await fs.writeFile(pathNoticias, JSON.stringify(json, null, 2));
        //respuesta del servidor al formulario
        res.json({
            ok: true,
            msj: 'Noticia agregada con éxito.',
            data: formulario
        })


    } catch (error) {
        console.log("servidor:", `Mensaje: ${error}`)
        res.json({
            ok: false,
            msj: `Ocurrio un fallo, mensaje: ${error}`,
            data: {}
        })
    }
}


exports.formularioNoticias = async (req, res) => {

    try {

        const archivo = await fs.readFile(pathCategoria, 'utf8')
        const json = JSON.parse(archivo)

        res.render('noticias_formulario', {
            title: 'Noticia nueva',
            categoria: json.categorias
        })
    } catch (error) {
        console.error('Error al leer categorías:', error);

        res.render('noticias_formulario', {
            title: 'Noticia nueva',
            categoria: [],
            error: 'No se pudieron cargar las categorías'
        });
    }

}


exports.noticias = async (req, res) => {

    try {
        const archivo = await fs.readFile(pathNoticias, 'utf8')
        const json = JSON.parse(archivo)

        res.render('noticias', {
            noticia: json.noticias
        })

    } catch (error) {

    }


}