const express = require('express')
const router = express.Router()

const { getItems, getItemsCount, createItem, deleteItem, editItem, editdragItem, actualizarOrdenElementos, getNameByUrl, moveItem } = require('../controllers/links')
const { getDeskItems, deleteDeskItem, createDeskItem, editDeskItem, testTemplates } = require('../controllers/escritorios')
const { getColItems, createColItem, deleteColItem, editColItem, actualizarOrdenColumnas, moveColumns } = require('../controllers/columnas')
const { registraUsuario, compruebaUsuario, eliminaUsuario } = require('../controllers/auth')
const { authMiddleware } = require('../middleware/session')
const { displayUserProfile } = require('../controllers/users')

const { createDummyContent, insertLinks } = require('../helpers/createDummyContent')

router.get('/', (req, res) => {
  res.render('landing.pug')
})
router.get('/templates', authMiddleware, testTemplates)
router.get('/columnas', getColItems)
router.get('/escritorios', getDeskItems)
router.get('/links', authMiddleware, getItems)
router.get('/linksCount', getItemsCount)
router.get('/linkName', getNameByUrl)
router.post('/', createItem)
router.post('/escritorios', createDeskItem)
router.post('/links', createItem)
router.post('/columnas', createColItem)
router.delete('/columnas', deleteColItem)
router.delete('/links', deleteItem)
router.delete('/escritorios', deleteDeskItem)
router.put('/escritorios', editDeskItem)
router.put('/columnas', editColItem)
router.put('/moveCols', moveColumns)
router.put('/moveLinks', moveItem)
router.put('/links', editItem)
router.put('/draglinks', editdragItem)
router.put('/draglink', actualizarOrdenElementos)
router.put('/dragcol', actualizarOrdenColumnas)
router.post('/register', registraUsuario)
router.post('/login', compruebaUsuario)
router.get('/deleteUser', authMiddleware, eliminaUsuario)
router.get('/profile', authMiddleware, displayUserProfile)

router.get('/test', insertLinks)

/* .get("/~", (req, res) => {
    almacenar ruta peticion en variable para comparar en db
    consulta db
    si existe -> render a file.pug
    si no error 404
}) */

module.exports = router
