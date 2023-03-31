const {linksModel} = require("../models/index");

/**
 * Obtener lista de enlaces
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    const data = await linksModel.find({name: 'Google'});
    //res.send({data});
    let locals = {
        title : "Sergio Start Page",
        name : data[0]["name"],
        URL : data[0]["URL"]
    }
    res.render("index", locals)
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
    const data = await linksModel.create(body)
    res.send({data}); 
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
const deleteItem = (req, res) => {}



module.exports = { getItem, getItems, createItem, updateItem, deleteItem};