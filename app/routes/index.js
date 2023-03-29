const express = require("express"),
      router = express.Router();
      
const {getItems, getItem, createItem, ajaxTest} = require("../controllers/links")


function pug(req, res, next) {
    let locals = {
        title : "Sergio Start Page"
    }

    res.render("index", locals)
}

// router.get("/", (req, res) => {
//         res.render("index.pug")
// })     .get("/pug", pug)

router.get("/", getItems); 
router.get("/:id", getItem); 
router.post("/", createItem);
router.post("/ajax", ajaxTest);

/*.get("/~", (req, res) => {
    almacenar ruta peticion en variable para comparar en db
    consulta db
    si existe -> render a file.pug
    si no error 404     
})*/

module.exports = router