const { usersModel } = require("../models/index");
const {encrypt, compare} = require("../helpers/handlePassword")

const registraUsuario = async (req, res) => {
    const { body } = req;
    const objeto = new Object();
    objeto.name = body.name;
    objeto.email = body.email;
    objeto.password = body.password;
    objeto.password = await encrypt(objeto.password);
    
    //console.log(body);
    //console.log(objeto);
    
    const data = await usersModel.create(objeto)
    const lista = await usersModel.find({ name: `${body.name}` });
    res.send(lista);
}

module.exports = {registraUsuario};