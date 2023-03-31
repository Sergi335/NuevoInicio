const express = require("express"),
      router = express.Router();
      
const {getItems, getItem, createItem} = require("../controllers/links")
const {ajaxTest, getDeskItems} = require("../controllers/escritorios")
const {getColItems, createColItem, deleteColItem} = require("../controllers/columnas")


function pug(req, res, next) {
    let locals = {
        title : "Sergio Start Page"
    }

    res.render("index", locals)
}

// router.get("/", (req, res) => {
//         res.render("index.pug")
// })     .get("/pug", pug)
router.get("/columnas", getColItems);
router.get("/escritorios", getDeskItems);
router.get("/", getItems); 
router.get("/:id", getItem); 
router.post("/", createItem);
router.post("/ajax", ajaxTest);
router.post("/columnas", createColItem);
router.delete("/columnas", deleteColItem);

/*.get("/~", (req, res) => {
    almacenar ruta peticion en variable para comparar en db
    consulta db
    si existe -> render a file.pug
    si no error 404     
})*/

module.exports = router