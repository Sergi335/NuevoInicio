const express = require("express"),
      router = express.Router()

router.get("/", (req, res) => {
    res.end("<h1>Terminamos configuraci&oacute;n</h1>")
})

module.exports = router