const {linksModel} = require("../models/index");

/**
 * Obtener lista de enlaces
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    const params = req.query.escritorio;
    const data = await linksModel.find({escritorio: `${params}`});
    console.log(data);
    res.send(data);
    // let locals = {
    //     title : "Sergio Start Page",
    //     name : data[0]["name"],
    //     URL : data[0]["URL"]
    // }
    // res.render("index", locals)
}
/**
 * Obtener enlace
 * @param {*} req 
 * @param {*} res 
 */
const getItem = (req, res) => {}
/**
 * Crear enlace nuevo
 * @param {*} req 
 * @param {*} res 
 */
const createItem = async (req, res) => {
    const {body} = req;
    console.log(body);
    const dbIDCol = body.id;
    console.log(dbIDCol);
    const objeto = new Object();
    objeto.name = body.nombre;
    objeto.URL = body.URL;
    objeto.imgURL = body.imgURL;
    objeto.escritorio = body.escritorio;
    objeto.panel = body.columna;
    objeto.idpanel = body.id;
    console.log(objeto);
    const data = await linksModel.create(objeto);
    //const lista = await linksModel.find({panel: `${objeto.panel}`, escritorio: `${objeto.escritorio}`});
    const lista = await linksModel.find({idpanel: `${objeto.idpanel}`, escritorio: `${objeto.escritorio}`});
    //console.log(lista);
    res.send(lista);
}
/**
 * Actualizar enlace
 * @param {*} req 
 * @param {*} res 
 */
const updateItem = (req, res) => {}
/**
 * Borrar enlace
 * @param {*} req 
 * @param {*} res 
 */
const deleteItem = async (req, res) => {
    const {body} = req;
    console.log(body);
    const objeto = new Object();
    objeto.name = body.nombre;
    objeto.panel = body.panel;
    objeto.escritorio = body.escritorio;
    objeto.id = body.id;
    console.log(objeto);
    const data = await linksModel.deleteOne({name: `${objeto.name}`, escritorio: `${objeto.escritorio}`, idpanel: `${objeto.id}`});
    const lista = await linksModel.find({idpanel: `${objeto.id}`, escritorio: `${objeto.escritorio}`});
    console.log(data);
    console.log(lista);
    res.send(lista);
    //res.send("Borrado")
}
const editItem = async (req, res) => {
    const {body} = req;
    //console.log(body);
    const objeto = new Object();
    objeto.nameOld = body.nombreOld;
    objeto.name = body.nombre;
    objeto.URL = body.URL;
    objeto.imgURL = body.imgURL;
    objeto.escritorio = body.escritorio;
    objeto.panel = body.columna;
    objeto.id = body.id
    //console.log(objeto);
    try {
        const documentoActualizado = await linksModel.findOneAndUpdate(
            { name: `${objeto.nameOld}`, escritorio: `${objeto.escritorio}`, panel: `${objeto.panel}`, idpanel: `${objeto.id}` }, // El filtro para buscar el documento
            { $set: { name: `${objeto.name}`, escritorio: `${objeto.escritorio}`, panel: `${objeto.panel}`, URL: `${objeto.URL}`, imgURL: `${objeto.imgURL}` } }, // La propiedad a actualizar
            { new: true } // Opciones adicionales (en este caso, devuelve el documento actualizado)   
        );
        console.log(documentoActualizado);
    } catch (error) {
        console.log(error); // Manejo de errores
        res.send(error)
    }
    const lista = await linksModel.find({panel: `${objeto.panel}`, escritorio: `${objeto.escritorio}`, idpanel: `${objeto.id}`});
    //console.log(lista);
    res.send(lista);
}
/**
 * Función de emergencia para actualizar ID, borrar al terminar
 * @param {*} req 
 * @param {*} res 
 */
const updateIDs = async (req, res) => {
    const {body} = req;
    const objeto = new Object;
    objeto.panel = body.panel;
    objeto.idpanel = body.idpanel;
    try {
        const actualizados = await linksModel.updateMany(
            {panel: `${objeto.panel}`}, // filtro para seleccionar los documentos a actualizar
            { $set: {idpanel: `${objeto.idpanel}` } } // actualiza el campo panel_id con el valor especificado
        );
        console.log(actualizados);
    } catch(error) {
        console.log(error); // Manejo de errores
        res.send(error)
    }
    res.send("OK");
}



module.exports = { getItem, getItems, createItem, updateItem, deleteItem, editItem, updateIDs};