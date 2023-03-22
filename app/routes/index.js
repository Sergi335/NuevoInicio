const express = require("express"),
      router = express.Router()


function pug(req, res, next) {
    let locals = {
        title : "Sergio Start Page"
    }

    res.render("index", locals)
}

router.get("/", (req, res) => {
        res.render("index.pug")
})     .get("/pug", pug)

module.exports = router