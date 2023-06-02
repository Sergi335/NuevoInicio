const { escritoriosModel, usersModel } = require('../models/index')
const { linksModel } = require('../models/index')
const { columnasModel } = require('../models/index')
const { createDummyContent } = require('../helpers/createDummyContent')

/**
 * Obtener lista de enlaces
 * @param {*} req
 * @param {*} res
 */
const getDeskItems = async (req, res) => {
  const data = await escritoriosModel.find()
  res.send(data)
}
/**
 * Edita escritorio
 * @param {*} req
 * @param {*} res
 */
const editDeskItem = async (req, res) => {
  const { body } = req
  console.log(body)
  // eslint-disable-next-line no-new-object
  const objeto = new Object()
  objeto.nameOld = body.nombreOld
  objeto.name = body.nombre
  objeto.user = body.user
  console.log(objeto)
  const seek = await escritoriosModel.find({ name: `${objeto.name}`, user: `${objeto.user}` })
  const err = { error: 'El escritorio ya existe' }
  if (seek.length > 0) {
    res.send(err)
  } else {
    try {
      await escritoriosModel.findOneAndUpdate(
        { name: `${objeto.nameOld}`, user: `${objeto.user}` }, // El filtro para buscar el documento
        { $set: { name: `${objeto.name}` } }, // La propiedad a actualizar
        { new: true } // Opciones adicionales (en este caso, devuelve el documento actualizado)
      )
      // Actualizamos las columnas
      const filtro = { escritorio: `${objeto.nameOld}`, user: `${objeto.user}` } // Filtrar documentos
      console.log(filtro)
      const actualizacion = { $set: { escritorio: `${objeto.name}` } } // Actualizar
      console.log(actualizacion)

      await columnasModel.updateMany(filtro, actualizacion)

      // Actualizamos los Links
      const filtroL = { escritorio: `${objeto.nameOld}`, user: `${objeto.user}` } // Filtrar documentos
      const actualizacionL = { $set: { escritorio: `${objeto.name}` } } // Actualizar

      await linksModel.updateMany(filtroL, actualizacionL)

      res.send(await escritoriosModel.find({ user: `${objeto.user}` }))
    } catch (error) {
      console.log(error) // Manejo de errores
      res.send(error)
    }
  }
}
const createDeskItem = async (req, res) => {
  const { body } = req
  console.log(body)
  // eslint-disable-next-line no-new-object
  const objeto = new Object()
  objeto.name = body.nombre
  objeto.user = body.user
  console.log(objeto)
  const seek = await escritoriosModel.find({ name: `${objeto.name}`, user: `${objeto.user}` })
  const err = { error: 'El escritorio ya existe' }
  if (seek.length > 0) {
    res.send(err)
  } else {
    await escritoriosModel.create(objeto)
    const lista = await escritoriosModel.find({ user: `${objeto.user}` })
    res.send(lista)
  }
}
const deleteDeskItem = async (req, res) => {
  console.log('Escritorio Borrado')
  const { body } = req
  console.log(body)
  // eslint-disable-next-line no-new-object
  const objeto = new Object()
  objeto.name = body.name
  console.log(objeto)
  const linksinDesk = await linksModel.deleteMany({ escritorio: `${objeto.name}` })
  const panelsinDesk = await columnasModel.deleteMany({ escritorio: `${objeto.name}` })
  const data = await escritoriosModel.deleteOne({ name: `${objeto.name}` })
  const lista = await escritoriosModel.find()
  console.log(data)
  console.log(linksinDesk)
  console.log(panelsinDesk)
  res.send(lista)
}
const testTemplates = async (req, res) => {
  const params = req.query.escritorio
  const user = req.cookies.user
  // User new? if si crear dummy content
  let isNewUser = await usersModel.find({ name: `${user}` })
  isNewUser = isNewUser[0].newUser
  console.log(`Es nuevo usuario? ${isNewUser}`)
  if (isNewUser) {
    // Insertar en DB
    await createDummyContent(user)
  }
  const escritorios = await escritoriosModel.find({ user }).sort({ orden: 1 })
  // console.log(escritorios)
  let escritorio
  if (params) {
    escritorio = params
  } else if (escritorios.length > 0) {
    escritorio = escritorios[0].name
  } else {
    escritorio = null
  }
  // console.log(escritorio)
  const columnas = await columnasModel.find({ user, escritorio }).sort({ order: 1 })
  const links = await linksModel.find({ user, escritorio }).sort({ orden: 1 })
  const locals = {
    escritorio,
    escritorios,
    columnas,
    links,
    user
  }
  console.log(locals)
  res.render('indexTemplates.pug', locals)
}
module.exports = { createDeskItem, getDeskItems, deleteDeskItem, editDeskItem, testTemplates }
