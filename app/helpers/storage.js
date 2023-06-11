const multer = require('multer')

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/storage') // Especifica la carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = file.originalname.split('.').pop()
    cb(null, `${uniqueSuffix}.${extension}`) // Renombra el archivo con un nombre único
  }
})

module.exports = { storage }
