const { escritoriosModel, usersModel } = require('../models/index')
const { linksModel } = require('../models/index')
const { columnasModel } = require('../models/index')
const { encrypt, compare } = require('../helpers/handlePassword')
const { tokenSign } = require('../helpers/handleJwt')

const registraUsuario = async (req, res) => {
  try {
    const { body } = req
    // eslint-disable-next-line no-new-object
    const objeto = new Object()
    objeto.name = body.name
    objeto.email = body.email
    objeto.password = body.password
    objeto.password = await encrypt(objeto.password)
    objeto.newUser = true

    // console.log(body);
    // console.log(objeto);

    const dataUser = await usersModel.create(objeto)
    // const lista = await usersModel.find({ name: `${body.name}` })
    console.log(dataUser)
    const data = {
      token: await tokenSign(dataUser),
      user: dataUser
    }
    // res.redirect('http://localhost:3001/templates')
    res.send(data)
  } catch (e) {
    const message = 'Error al crear usuario'
    res.send({ message })
  }
}
const compruebaUsuario = async (req, res) => {
  try {
    const { body } = req
    // eslint-disable-next-line no-new-object
    const objeto = new Object()
    objeto.name = body.name
    objeto.password = body.password
    const dataUser = await usersModel.find({ name: `${body.name}` })
    const oldPass = dataUser[0].password
    console.log(dataUser[0].password)
    const resultado = await compare(objeto.password, oldPass)
    if (!resultado) {
      const message = 'Error usuario o contraseña incorrecta'
      res.send({ message })
    } else {
      const data = {
        token: await tokenSign(dataUser[0]),
        user: dataUser
      }
      console.log(dataUser)
      res.send(data)
    }
  } catch (e) {
    const message = 'Error usuario o contraseña incorrecta'
    res.send({ message })
  }
}
const eliminaUsuario = async (req, res) => {
  try {
    const nombre = req.cookies.user
    const dataUser = await usersModel.find({ name: `${nombre}` })
    console.log(dataUser.name)
    let message
    if (dataUser.length === 1) {
      const name = dataUser[0].name
      // Borrar los links del usuario
      await linksModel.deleteMany({ user: name })

      // Borrar las columnas del usuario
      await columnasModel.deleteMany({ user: name })

      // Borrar los escritorios del usuario
      await escritoriosModel.deleteMany({ user: name })

      // Borrar el usuario
      await usersModel.findOneAndDelete({ name })

      console.log('Borrado exitoso')
      message = `Usuario ${dataUser[0].name} eliminado correctamente`
      res.send({ message })
    }
    if (dataUser.length === 0) {
      message = 'Error usuario no encontrado'
      res.send({ message })
    }
    if (dataUser.length > 1) {
      message = 'Error al eliminar el usuario'
      res.send({ message })
    }
  } catch (e) {
    const message = 'Error al eliminar el usuario'
    res.send({ message })
  }
}
module.exports = { registraUsuario, compruebaUsuario, eliminaUsuario }
