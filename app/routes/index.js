const express = require("express"),
      router = express.Router();
      
const {getItems, getItemsCount, createItem, deleteItem, editItem, editdragItem, actualizarOrdenElementos} = require("../controllers/links")
const {getDeskItems, deleteDeskItem, createDeskItem, editDeskItem, testTemplates} = require("../controllers/escritorios")
const {getColItems, createColItem, deleteColItem, editColItem, actualizarOrdenColumnas} = require("../controllers/columnas")
const {registraUsuario} = require("../controllers/auth");


function pug(req, res, next) {
    let locals = {
        title : "Sergio Start Page"
    }

    res.render("index", locals)
}

router.get("/", (req, res) => {
        res.render("index.pug")
})     //.get("/pug", pug)
router.get("/templates", testTemplates);
router.get("/columnas", getColItems);
router.get("/escritorios", getDeskItems);
router.get("/links", getItems); 
router.get("/linksCount", getItemsCount); 
router.post("/", createItem);
router.post("/escritorios", createDeskItem);
router.post("/links", createItem);
router.post("/columnas", createColItem);
router.delete("/columnas", deleteColItem);
router.delete("/links", deleteItem);
router.delete("/escritorios", deleteDeskItem);
router.put("/escritorios", editDeskItem);
router.put("/columnas", editColItem);
router.put("/links", editItem);
router.put("/draglinks", editdragItem);
router.put("/draglink", actualizarOrdenElementos);
router.put("/dragcol", actualizarOrdenColumnas)
router.post("/login", registraUsuario);

/*.get("/~", (req, res) => {
    almacenar ruta peticion en variable para comparar en db
    consulta db
    si existe -> render a file.pug
    si no error 404     
})*/

module.exports = router