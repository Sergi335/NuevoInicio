const { escritoriosModel } = require("../models/index");
const { linksModel } = require("../models/index");
const { columnasModel } = require("../models/index")

/**
 * Obtener lista de enlaces
 * @param {*} req 
 * @param {*} res 
 */
const getDeskItems = async (req, res) => {
    const data = await escritoriosModel.find();
    //res.send({data});
    res.send(data)
}
const editDeskItem = async (req, res) => {
    const { body } = req;
    console.log(body);
    const objeto = new Object();
    objeto.nameOld = body.nombreOld;
    objeto.name = body.nombre;
    console.log(objeto);
    const seek = await escritoriosModel.find({ name: `${objeto.name}` })
    const err = { "error": "El escritorio ya existe" }
    if (seek.length > 0) {
        res.send(err);
    } else {
        try {
            const documentoActualizado = await escritoriosModel.findOneAndUpdate(
                { name: `${objeto.nameOld}` }, // El filtro para buscar el documento
                { $set: { name: `${objeto.name}` } }, // La propiedad a actualizar
                { new: true } // Opciones adicionales (en este caso, devuelve el documento actualizado)   
            );
            //Actualizamos las columnas
            const filtro = { escritorio: `${objeto.nameOld}`}; // Filtrar documentos
            console.log(filtro);
            const actualizacion = { $set: { escritorio: `${objeto.name}` } }; // Actualizar
            console.log(actualizacion);

            const resultado = await columnasModel.updateMany(filtro, actualizacion);

            //Actualizamos los Links
            const filtroL = { escritorio: `${objeto.nameOld}`}; // Filtrar documentos
            const actualizacionL = { $set: { escritorio: `${objeto.name}` } }; // Actualizar

            const resultadoL = await linksModel.updateMany(filtroL, actualizacionL);

            res.send( await escritoriosModel.find());

        } catch (error) {
            console.log(error); // Manejo de errores
            res.send(error)
        }

    }
}
const createDeskItem = async (req, res) => {
    const { body } = req;
    console.log(body);
    const objeto = new Object();
    objeto.name = body.nombre;
    console.log(objeto);
    const seek = await escritoriosModel.find({ name: `${objeto.name}` })
    const err = { "error": "El escritorio ya existe" }
    if (seek.length > 0) {
        res.send(err);
    } else {
        const data = await escritoriosModel.create(objeto)
        const lista = await escritoriosModel.find()
        res.send(lista);
    }
}
const deleteDeskItem = async (req, res) => {
    console.log("Escritorio Borrado");
    const { body } = req;
    console.log(body);
    const objeto = new Object();
    objeto.name = body.name;
    console.log(objeto);
    const linksinDesk = await linksModel.deleteMany({ escritorio: `${objeto.name}` })
    const panelsinDesk = await columnasModel.deleteMany({ escritorio: `${objeto.name}` })
    const data = await escritoriosModel.deleteOne({ name: `${objeto.name}` })
    const lista = await escritoriosModel.find();
    console.log(data);
    console.log(linksinDesk);
    console.log(panelsinDesk);
    res.send(lista);
}
const testTemplates = async (req, res) => {
    const params = req.query.escritorio;
    const escritorios = await escritoriosModel.find();
    
    let escritorio;
    if(params) {
        escritorio = params;
    } else {
        escritorio = escritorios[0].name;
    }
    console.log(escritorio);
    const columnas = await columnasModel.find({ escritorio: escritorio }).sort({ order: 1 });
    const links = await linksModel.find({ escritorio: escritorio }).sort({ orden: 1 });
    let locals = {
        escritorio : escritorio,
        escritorios : escritorios,
        columnas : columnas,
        links : links
    }
    res.render("indexTemplates.pug", locals);
}
module.exports = { createDeskItem, getDeskItems, deleteDeskItem, editDeskItem, testTemplates };