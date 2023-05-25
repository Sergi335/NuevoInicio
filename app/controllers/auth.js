const { usersModel } = require("../models/index");
const { encrypt, compare } = require("../helpers/handlePassword")
const { tokenSign } = require("../helpers/handleJwt")

const registraUsuario = async (req, res) => {
    try {
        const { body } = req;
        const objeto = new Object();
        objeto.name = body.name;
        objeto.email = body.email;
        objeto.password = body.password;
        objeto.password = await encrypt(objeto.password);

        //console.log(body);
        //console.log(objeto);

        const dataUser = await usersModel.create(objeto)
        const lista = await usersModel.find({ name: `${body.name}` });
        console.log(dataUser);
        const data = {
            token: await tokenSign(dataUser),
            user: dataUser
        }
        res.send(data);
    } catch (e) {
        let message = 'Error al crear usuario'
        res.send({ message });
    }

}
const compruebaUsuario = async (req, res) => {
    try {
        const { body } = req;
        const objeto = new Object();
        objeto.name = body.name;
        objeto.password = body.password;
        const dataUser = await usersModel.find({ name: `${body.name}` });
        oldPass = dataUser[0].password;
        console.log(dataUser[0].password);
        const resultado = await compare(objeto.password, oldPass);
        if (!resultado) {
            let message = 'Error usuario o contraseña incorrecta'
            res.send({ message })
        } else {
            const data = {
                token: await tokenSign(dataUser[0]),
                user: dataUser
            }
            console.log(dataUser);
            res.send(data);
        }


    } catch (e) {
        let message = 'Error usuario o contraseña incorrecta'
        res.send({ message });
    }

}
module.exports = { registraUsuario, compruebaUsuario };