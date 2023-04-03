const {escritoriosModel} = require("../models/index");
const {linksModel} = require("../models/index");
const {columnasModel} = require("../models/index")

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
const createDeskItem = async (req, res) => {
    const {body} = req;
    console.log(body);
    const objeto = new Object();
    objeto.name = body.nombre;
    console.log(objeto);
    const seek = await escritoriosModel.find({name: `${objeto.name}`})
    const err = {"error": "El escritorio ya existe"}
    if(seek.length > 0) {
        res.send(err);
    } else {
        const data = await escritoriosModel.create(objeto)
        const lista = await escritoriosModel.find()
        res.send(lista);
    }    
}
const deleteDeskItem = async (req, res) => {
    console.log("Escritorio Borrado");
    const {body} = req;
    console.log(body);
    const objeto = new Object();
    objeto.name = body.name;
    console.log(objeto);
    const linksinDesk = await linksModel.deleteMany({escritorio: `${objeto.name}`})
    const panelsinDesk = await columnasModel.deleteMany({escritorio: `${objeto.name}`})
    const data = await escritoriosModel.deleteOne({name: `${objeto.name}`})
    const lista = await escritoriosModel.find();
    console.log(data);
    console.log(linksinDesk);
    console.log(panelsinDesk);
    res.send(lista);
}
module.exports = {createDeskItem, getDeskItems, deleteDeskItem};