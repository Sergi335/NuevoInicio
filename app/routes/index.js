const express = require("express"),
      router = express.Router();
      
const {getItems, getItem, createItem, deleteItem, editItem} = require("../controllers/links")
const {getDeskItems, deleteDeskItem, createDeskItem, editDeskItem} = require("../controllers/escritorios")
const {getColItems, createColItem, deleteColItem, editColItem} = require("../controllers/columnas")


function pug(req, res, next) {
    let locals = {
        title : "Sergio Start Page"
    }

    res.render("index", locals)
}

router.get("/", (req, res) => {
        res.render("index.pug")
})     //.get("/pug", pug)
router.get("/columnas", getColItems);
router.get("/escritorios", getDeskItems);
router.get("/links", getItems); 
router.get("/:id", getItem); 
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

/*.get("/~", (req, res) => {
    almacenar ruta peticion en variable para comparar en db
    consulta db
    si existe -> render a file.pug
    si no error 404     
})*/

module.exports = router