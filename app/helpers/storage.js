const multer = require('multer')
const fs = require('fs')

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req)
    console.log(file)
    console.log(req.route.path)
    const user = req.user.name
    let folder = `public/storage/${user}`
    if (req.route.path === '/uploadImg') {
      folder = `public/storage/linksImg/${user}`
    }
    // Comprueba si el directorio existe
    if (!fs.existsSync(folder)) {
      fs.mkdir(folder, { recursive: true }, (err) => {
        if (err) {
          console.error('Error al crear el directorio:', err)
          cb(err) // Llama al callback con un error
        } else {
          cb(null, folder) // Llama al callback con la ruta del directorio
        }
      })
    } else {
      cb(null, folder) // Llama al callback con la ruta del directorio
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = file.originalname.split('.').pop()
    cb(null, `${uniqueSuffix}.${extension}`) // Renombra el archivo con un nombre único
  }
})

module.exports = { storage }
