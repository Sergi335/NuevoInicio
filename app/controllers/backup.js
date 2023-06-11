const { escritoriosModel, linksModel, columnasModel } = require('../models/index')
const fs = require('fs')
const path = require('path')

async function backup (req, res) {
  // console.log(req.user.name)
  const user = req.user.name
  try {
    const data1 = await escritoriosModel.find({ user }).lean()
    const data2 = await columnasModel.find({ user }).lean()
    const data3 = await linksModel.find({ user }).lean()

    const backupData = {
      escritorios: data1,
      columnas: data2,
      links: data3
    }
    // Obtener la ruta completa del directorio de backups
    const backupDir = path.join(__dirname, '..', '..', 'public', 'backups')
    const fileName = `${user}dataBackup.json`
    const backupFilePath = path.join(backupDir, fileName)
    console.log(backupFilePath)
    // Crear el archivo JSON de copia de seguridad
    fs.writeFileSync(backupFilePath, JSON.stringify(backupData))

    console.log('Copia de seguridad creada correctamente.')
    const mensaje = 'Copia de seguridad creada correctamente.'
    res.send({ mensaje })
  } catch (error) {
    const mensaje = 'Error al crear la copia de seguridad'
    console.error('Error al crear la copia de seguridad:', error)
    res.send({ mensaje })
  }
}

async function restore (req, res) {
  const user = req.user.name
  const backupFilePath = req.file.path

  try {
    // Leer el archivo de copia de seguridad
    const data = fs.readFileSync(backupFilePath, 'utf8')
    const jsonData = JSON.parse(data)

    // Borrar los documentos existentes en las colecciones
    await escritoriosModel.deleteMany({ user })
    await columnasModel.deleteMany({ user })
    await linksModel.deleteMany({ user })

    // Insertar los documentos de la copia de seguridad en las colecciones
    await escritoriosModel.insertMany(jsonData.escritorios)
    await columnasModel.insertMany(jsonData.columnas)
    await linksModel.insertMany(jsonData.links)
    const mensaje = 'Copia de seguridad restaurada correctamente.'

    console.log('Copia de seguridad restaurada correctamente.')
    res.send({ mensaje })
  } catch (error) {
    const mensaje = 'Error al restaurar la copia de seguridad'
    console.error('Error al restaurar la copia de seguridad:', error)
    res.send({ mensaje })
  }
}
async function downloadBackup (req, res) {
  const user = req.user.name
  console.log('Entro en la funcion')
  const backupFilePath = path.join(__dirname, '..', '..', 'public', 'backups')
  const fileName = `${user}dataBackup.json`
  const filePath = path.join(backupFilePath, fileName)
  console.log(backupFilePath)
  console.log(fileName)

  res.download(filePath, fileName, (err) => {
    if (err) {
      // Manejar cualquier error que ocurra durante la descarga
      console.error('Error al descargar la copia de seguridad:', err)
      res.status(500).send('Error al descargar la copia de seguridad')
    }
  })
}
module.exports = { backup, restore, downloadBackup }
