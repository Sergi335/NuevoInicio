const { columnasModel } = require("../models/index");
const { linksModel } = require("../models/index");

/**
 * Obtener lista de enlaces
 * @param {*} req 
 * @param {*} res 
 */
const getColItems = async (req, res) => {
    const params = req.query.escritorio;
    const data = await columnasModel.find({ escritorio: `${params}` });
    console.log(params);
    res.send(data)
}
const createColItem = async (req, res) => {
    const { body } = req;
    console.log(body);
    const objeto = new Object();
    objeto.name = body.nombre;
    objeto.escritorio = body.escritorio;
    console.log(objeto);
    const data = await columnasModel.create(objeto)
    const lista = await columnasModel.find({ escritorio: `${body.escritorio}` });
    res.send(lista);
}
const deleteColItem = async (req, res) => {
    const { body } = req;
    console.log(body);
    const objeto = new Object();
    objeto._id = body.id;
    objeto.escritorio = body.escritorio;
    console.log(objeto);
    const linksinCol = await linksModel.deleteMany({ idpanel: `${objeto._id}` })
    const data = await columnasModel.deleteOne({ _id: `${objeto._id}` })
    const lista = await columnasModel.find({ escritorio: `${objeto.escritorio}` });
    console.log(data);
    console.log(linksinCol);
    res.send(lista);
    //res.send("Borrado")
}
const editColItem = async (req, res) => {
    const { body } = req;
    console.log(body);
    const objeto = new Object();
    objeto.escritorio = body.escritorio;
    objeto.nameOld = body.nombreOld;
    objeto.name = body.nombre;
    console.log(objeto);
    try {
        const documentoActualizado = await columnasModel.findOneAndUpdate(
            { name: `${objeto.nameOld}`, escritorio: `${objeto.escritorio}` }, // El filtro para buscar el documento
            { $set: { name: `${objeto.name}` } }, // La propiedad a actualizar
            { new: true } // Opciones adicionales (en este caso, devuelve el documento actualizado)   
        );
        //Actualizamos los Links
        const filtroL = { panel: `${objeto.nameOld}`, escritorio: `${objeto.escritorio}` }; // Filtrar documentos
        const actualizacionL = { $set: { panel: `${objeto.name}` } }; // Actualizar

        const resultadoL = await linksModel.updateMany(filtroL, actualizacionL);
        const lista = await columnasModel.find({ escritorio: `${body.escritorio}` });
        res.send(lista);

    } catch (error) {
        console.log(error); // Manejo de errores
        res.send(error)
    }

}
module.exports = { createColItem, getColItems, deleteColItem, editColItem };