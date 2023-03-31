const {columnasModel} = require("../models/index");

/**
 * Obtener lista de enlaces
 * @param {*} req 
 * @param {*} res 
 */
const getColItems = async (req, res) => {
    const params = req.query.escritorio;
    const data = await columnasModel.find({escritorio: `${params}`});
    console.log(params);
    res.send(data)
}
const createColItem = async (req, res) => {
    const {body} = req;
    console.log(body);
    const objeto = new Object();
    objeto.name = body.nombre;
    objeto.escritorio = body.escritorio;
    console.log(objeto);
    const data = await columnasModel.create(objeto)
    const lista = await columnasModel.find({escritorio: `${body.escritorio}`});
    res.send(lista);
}
const deleteColItem = async (req, res) => {
    const {body} = req;
    console.log(body);
    const objeto = new Object();
    objeto.name = body.nombre;
    objeto.escritorio = body.escritorio;
    console.log(objeto);
    const data = await columnasModel.deleteOne({name: `${objeto.name}`})
    const lista = await columnasModel.find({escritorio: `${objeto.escritorio}`});
    console.log(data);
    res.send(lista);
    //res.send("Borrado")
}
module.exports = {createColItem, getColItems, deleteColItem};