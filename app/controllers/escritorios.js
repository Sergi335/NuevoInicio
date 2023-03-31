const {escritoriosModel} = require("../models/index");

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
const ajaxTest = async (req, res) => {
    const {body} = req;
    console.log(body);
    const objeto = new Object();
    objeto.name = body.nombre;
    console.log(objeto);
    const data = await escritoriosModel.create(objeto)
    const lista = await escritoriosModel.find()
    res.send(lista);
}
module.exports = {ajaxTest, getDeskItems};