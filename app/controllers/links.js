const { linksModel, columnasModel } = require('../models/index')
const { handleHttpError } = require('../helpers/handleError')
const axios = require('axios')
const cheerio = require('cheerio')
// const https = require('https')

// const httpsAgent = new https.Agent({
//     rejectUnauthorized: false,
// });
const getItem = async (req, res) => {
  const user = req.user.name
  const idLink = req.query.id
  const data = await linksModel.find({ _id: idLink, user })
  console.log(data)
  res.send({ data })
}
const setNotes = async (req, res) => {
  const { body } = req
  const user = req.user.name
  const idLink = body.id
  const data = await linksModel.findOneAndUpdate({ _id: idLink, user }, { $set: { notes: body.notes } })
  console.log(data)
  res.send({ data })
}
const setLinkImg = async (req, res) => {
  const user = req.user.name
  console.log(req.body.linkId)
  // Obtén la ruta del archivo subido desde multer
  if (req.file) {
    const imagePath = req.file.path
    const newPath = imagePath.replace(/^public\\/, '')
    console.log(user)
    console.log(imagePath)
    const data = await linksModel.findOneAndUpdate({ _id: req.body.linkId, user }, { $set: { imgURL: newPath } })
    console.log(data)
    res.send({ ok: 'Imagen subida y actualizada' })
  } else {
    console.log('No hay imagePath')
    console.log(req.body.filePath)
    const data = await linksModel.findOneAndUpdate({ _id: req.body.linkId, user }, { $set: { imgURL: req.body.filePath } })
    console.log(data)
    res.send({ ok: 'Imagen de muestra añadida' })
  }
}
const getNameByUrl = async (req, res) => {
  const url = req.query.url
  axios.get(url)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)
      const title = $('title').text()
      console.log('El título de la página es: ' + title)
      res.send(title)
    })
    .catch(error => {
      console.log('Hubo un error al obtener el título de la página:', error)
    })
}
/**
 * Funcion emergencia creada para actualizar la db con el campo orden de cada
 * link en cada panel, no se usa.
 * @param {*} req
 * @param {*} res
 */
// eslint-disable-next-line no-unused-vars
const setOrder = async (req, res) => {
  try {
    const { body } = req

    // Obtener los paneles del escritorio
    const data = await linksModel.find({ escritorio: body.escritorio })
    const paneles = [...new Set(data.map((element) => element.panel))]

    // Actualizar el campo "orden" para cada elemento del panel
    for (const panel of paneles) {
      const elementosPanel = await linksModel
        .find({ escritorio: body.escritorio, panel })
        .sort({ orden: 1 })

      for (let i = 0; i < elementosPanel.length; i++) {
        await linksModel.findByIdAndUpdate(
          elementosPanel[i]._id,
          { $set: { orden: i } }
        )
      }
    }

    // Obtener la lista ordenada por el campo "orden"
    const lista = await linksModel
      .find({ escritorio: body.escritorio }) // filtrar por panel tmb
      .sort({ orden: 1 })

    // res.send(lista);
    return lista
  } catch (error) {
    console.error(error)
    res.status(500).send('Error interno del servidor')
  }
}
/**
* Funcion para ordenar los links de un escritorio y un panel pasados como parametro según su campo * orden, es llamada por: editDragItem, deleteItem
* @param {*} req
* @param {*} res
*/
const setOrder2 = async (desk, panel) => {
  try {
    console.log(desk, panel)

    // Actualizar el campo "orden" para cada elemento del panel
    const elementosPanel = await linksModel
      .find({ escritorio: desk, idpanel: panel })
      .sort({ orden: 1 })

    for (let i = 0; i < elementosPanel.length; i++) {
      await linksModel.findByIdAndUpdate(
        elementosPanel[i]._id,
        { $set: { orden: i } }
      )
    }
    // Obtener la lista ordenada por el campo "orden"
    const lista = await linksModel
      .find({ escritorio: desk, idpanel: panel })
      .sort({ orden: 1 })

    // console.log(`La lista es: ${lista}`);
    return lista
  } catch (error) {
    console.error(error)
    // eslint-disable-next-line no-undef
    res.status(500).send('Error interno del servidor')
  }
}
/**
 * Obtener lista de enlaces ordenados por el campo orden ascendente de un escritorio
 * pasado por la query, escritorio entero ojo rendimiento.
 * @param {*} req
 * @param {*} res
 */
const getItems = async (req, res) => {
  try {
    const user = req.user
    const params = req.query.escritorio
    const data = await linksModel.find({ escritorio: `${params}` }).sort({ orden: 1 })
    console.log(user)

    res.send(data)
  } catch (e) {
    console.log(e)
    handleHttpError(res, 'ERROR_RECOGIENDO_ITEMS')
  }
}
/**
 * Obtener enlace, no se usa pero está exportada
 * @param {*} req
 * @param {*} res
 */
const getItemsCount = async (req, res) => {
  const params = req.query.idpanel
  // const data = await linksModel.countDocuments({ idpanel: `${params}` });
  const data = await linksModel.find({ idpanel: `${params}` })

  res.send(String(data.length))
  // res.send('estas aqui')
}
/**
 * Crear enlace nuevo
 * @param {*} req
 * @param {*} res
 */
const createItem = async (req, res) => {
  const { body } = req
  // console.log(body);
  const user = req.user.name
  const objeto = {}
  objeto.name = body.nombre
  if (body.nombre === undefined) {
    console.log('Hay que consultar el nombre')
  }
  objeto.URL = body.URL
  objeto.imgURL = body.imgURL
  objeto.escritorio = body.escritorio
  objeto.panel = body.columna
  objeto.idpanel = body.id
  objeto.orden = body.orden
  objeto.user = user
  // Find idpanel si estaba vacio cambiar flag a false
  const count = await linksModel.find({ idpanel: objeto.idpanel, user })
  if (count.length === 0) {
    console.log('Estaba vacia')
    await columnasModel.findOneAndUpdate({ _id: objeto.idpanel, user }, { $set: { vacio: false } })
  } else {
    console.log('No estaba vacia')
  }
  const findDuplicate = await linksModel.find({ name: body.nombre, idpanel: body.id, user })
  console.log(findDuplicate)
  console.log(findDuplicate.length)
  if (findDuplicate.length === 0) {
    const data = await linksModel.create(objeto)
    res.send(data)
  } else {
    const err = { error: 'El link ya existe en esta columna' }
    res.send(err)
  }

  // Obtener los paneles del escritorio
  const data2 = await linksModel.find({ escritorio: body.escritorio, panel: body.columna })
  const paneles = [...new Set(data2.map((element) => element.panel))]

  // Actualizar el campo "orden" para cada elemento del panel, se podría llamar a setOrder2?
  for (const panel of paneles) {
    const elementosPanel = await linksModel
      .find({ escritorio: body.escritorio, panel, user })
      .sort({ orden: 1 })

    for (let i = 0; i < elementosPanel.length; i++) {
      await linksModel.findByIdAndUpdate(
        elementosPanel[i]._id,
        { $set: { orden: i } }
      )
    }
  }
}
/**
 * Actualizar enlace al arrastrar entre columnas
 * @param {*} req
 * @param {*} res
 */
const editdragItem = async (req, res) => {
  const { body } = req
  // eslint-disable-next-line no-new-object
  const objeto = new Object()
  objeto.oldId = body.oldId
  objeto.newId = body.newId
  objeto.name = body.name
  objeto.escritorio = body.escritorio
  objeto.panel = body.panel

  // Si el elemento es arrastrado a una columna distinta
  if (objeto.oldId !== objeto.newId) {
    try {
      await linksModel.findOneAndUpdate(
        { name: `${objeto.name}`, escritorio: `${objeto.escritorio}`, idpanel: `${objeto.oldId}` }, // El filtro para buscar el documento
        { $set: { name: `${objeto.name}`, escritorio: `${objeto.escritorio}`, idpanel: `${objeto.newId}`, panel: `${objeto.panel}` } }, // La propiedad a actualizar
        { new: true } // Opciones adicionales (en este caso, devuelve el documento actualizado)
      )
      // Buscar en la old y new y si están vacias o no cambiar
      const count = await linksModel.find({ idpanel: objeto.oldId })
      if (count.length === 0) {
        console.log('Se queda vacia')
        await columnasModel.findOneAndUpdate({ _id: objeto.oldId }, { $set: { vacio: true } })
      } else {
        console.log('No se queda vacia')
        await columnasModel.findOneAndUpdate({ _id: objeto.oldId }, { $set: { vacio: false } })
      }
      await columnasModel.findOneAndUpdate({ _id: objeto.newId }, { $set: { vacio: false } })
    } catch (error) {
      console.log(error) // Manejo de errores
      res.send(error)
    }
    let lista = []
    lista = lista.concat(await setOrder2(objeto.escritorio, objeto.newId))
    lista = lista.concat(await setOrder2(objeto.escritorio, objeto.oldId))
    res.send(lista)
  } else {
    res.send({ Respuesta: 'Elemento arrastrado en la misma columna' })
  }
}
/**
 * Borra enlace
 * @param {*} req
 * @param {*} res
 */
const deleteItem = async (req, res) => {
  const { body } = req
  const user = req.user.name
  console.log(body)
  await linksModel.deleteOne({ name: `${body.nombre}`, escritorio: `${body.escritorio}`, idpanel: `${body.id}`, user })
  // Find y contar si 0 cambiar vacio true
  const count = await linksModel.find({ idpanel: body.id, user })
  if (count.length === 0) {
    console.log('Esta vacia')
    await columnasModel.findOneAndUpdate({ _id: body.id, user }, { $set: { vacio: true } })
  } else {
    console.log('No esta vacia')
  }
  const lista = await setOrder2(body.escritorio, body.id)
  res.send(lista)
}
/**
 * Edita enlace
 * @param {*} req
 * @param {*} res
 */
const editItem = async (req, res) => {
  const { body } = req
  const user = req.user.name
  console.log(user)
  console.log(body)

  try {
    const documentoActualizado = await linksModel.findOneAndUpdate(
      { name: `${body.nombreOld}`, escritorio: `${body.escritorio}`, panel: `${body.columna}`, idpanel: `${body.id}`, user }, // El filtro para buscar el documento
      { $set: { name: `${body.nombre}`, escritorio: `${body.escritorio}`, panel: `${body.columna}`, URL: `${body.URL}`, imgURL: `${body.imgURL}` } }, // La propiedad a actualizar
      { new: true } // Opciones adicionales (en este caso, devuelve el documento actualizado)
    )
    if (documentoActualizado !== null) {
      res.send(documentoActualizado)
      console.log(documentoActualizado)
    } else {
      res.send({ error: 'documento no encontrado' })
    }
  } catch (error) {
    console.log(error) // Manejo de errores
    res.send(error)
  }
}
const moveItem = async (req, res) => {
  const { body } = req
  const user = req.user.name
  console.log(body)
  await linksModel.findOneAndUpdate({ name: body.name, idpanel: body.panelOrigenId, user }, { $set: { idpanel: body.panelDestinoId, panel: body.panelDestinoNombre, orden: body.orden } })
  const link = await linksModel.find({ name: body.name, idpanel: body.panelDestinoId, user })
  const count = await linksModel.find({ idpanel: body.panelOrigenId, user })
  if (count.length === 0) {
    console.log('Estaba vacia')
    await columnasModel.findOneAndUpdate({ _id: body.panelOrigenId }, { $set: { vacio: true } })
  } else {
    console.log('No se queda vacia')
  }
  res.send(link[0])
}
/**
 * Función para actualizar orden de links dentro del mismo panel
 * @param {*} req
 * @param {*} res
 */
const actualizarOrdenElementos = async (req, res) => {
  try {
    const elementos = req.body.body
    console.log(elementos)
    const idColumna = req.query.idColumna

    // Creamos un mapa para almacenar el orden actual de los elementos
    const ordenActual = new Map()
    let orden = 0
    elementos.forEach((elemento) => {
      ordenActual.set(elemento, orden)
      orden++
    })

    // Actualizamos el campo "orden" de cada elemento en la base de datos
    const updates = elementos.map(async (elemento) => {
      const orden = ordenActual.get(elemento)
      await linksModel.findOneAndUpdate(
        { name: elemento, idpanel: idColumna },
        { orden },
        { new: true }
      )
    })
    await Promise.all(updates)

    const data = await linksModel.find({ idpanel: `${idColumna}` }).sort({ orden: 1 })
    // Enviamos la respuesta
    // res.status(200).json({ message: 'Elementos actualizados correctamente' });
    res.send(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar los elementos' })
  }
}

module.exports = { getItemsCount, getItems, createItem, deleteItem, editItem, editdragItem, actualizarOrdenElementos, getNameByUrl, moveItem, getItem, setNotes, setLinkImg }
