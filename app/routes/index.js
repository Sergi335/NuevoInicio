const express = require('express')
const router = express.Router()
const multer = require('multer')
const { storage } = require('../helpers/storage')
const upload = multer({ dest: '../public/backups/uploads/' })
const uploadLinkImg = multer({ storage })
const uploadImgProfile = multer({ storage })

const { getItems, getItemsCount, createItem, deleteItem, editItem, editdragItem, actualizarOrdenElementos, getNameByUrl, moveItem, getItem, setNotes, setLinkImg } = require('../controllers/links')
const { getDeskItems, deleteDeskItem, createDeskItem, editDeskItem, testTemplates, ordenaDesks, cagadasFix } = require('../controllers/escritorios')
const { getColItems, createColItem, deleteColItem, editColItem, actualizarOrdenColumnas, moveColumns } = require('../controllers/columnas')
const { registraUsuario, compruebaUsuario, eliminaUsuario } = require('../controllers/auth')
const { authMiddleware } = require('../middleware/session')
const { displayUserProfile, updateProfileImage } = require('../controllers/users')
const { searchLinks } = require('../controllers/searchController')
const { backup, restore, downloadBackup } = require('../controllers/backup')

const { insertLinks } = require('../helpers/createDummyContent')

router.get('/', (req, res) => {
  res.render('landing.pug')
})
router.get('/cagadas', cagadasFix)
router.get('/templates', authMiddleware, testTemplates)
router.get('/columnas', getColItems)
router.get('/escritorios', getDeskItems)
router.get('/downloadBackup', authMiddleware, downloadBackup)
router.get('/links', authMiddleware, getItems)
router.get('/link', authMiddleware, getItem)
router.get('/linksCount', getItemsCount)
router.get('/linkName', authMiddleware, getNameByUrl)
router.post('/', createItem)
router.post('/escritorios', authMiddleware, createDeskItem)
router.post('/links', authMiddleware, createItem)
router.post('/linkNotes', authMiddleware, setNotes)
router.post('/backup', authMiddleware, backup)
router.post('/uploadBackup', authMiddleware, upload.single('backupFile'), restore)
router.post('/uploadLinkImg', authMiddleware, uploadLinkImg.single('linkImg'), setLinkImg)
router.post('/uploadImgProfile', authMiddleware, uploadImgProfile.single('profileImage'), updateProfileImage)
router.post('/columnas', authMiddleware, createColItem)
router.delete('/columnas', authMiddleware, deleteColItem)
router.delete('/links', authMiddleware, deleteItem)
router.delete('/escritorios', authMiddleware, deleteDeskItem)
router.put('/escritorios', authMiddleware, editDeskItem)
router.put('/ordenaDesks', authMiddleware, ordenaDesks)
router.put('/columnas', authMiddleware, editColItem)
router.put('/moveCols', authMiddleware, moveColumns)
router.put('/moveLinks', authMiddleware, moveItem)
router.put('/links', authMiddleware, editItem)
router.put('/draglinks', editdragItem)
router.put('/draglink', actualizarOrdenElementos)
router.put('/dragcol', actualizarOrdenColumnas)
router.post('/register', registraUsuario)
router.post('/login', compruebaUsuario)
router.get('/search', authMiddleware, searchLinks)
router.get('/deleteUser', authMiddleware, eliminaUsuario)
router.get('/profile', authMiddleware, displayUserProfile)

router.get('/test', insertLinks)
// router.get('http://localhost:3001/node_modules/gridstack/dist/gridstack-all.js', function (req, res) {
//   res.set('Content-Type', 'application/javascript')
//   res.sendFile('../../node_modules/gridstack/dist/gridstack-all.js')
// })
/* .get("/~", (req, res) => {
    almacenar ruta peticion en variable para comparar en db
    consulta db
    si existe -> render a file.pug
    si no error 404
}) */

module.exports = router
