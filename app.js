const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())

const port = 3000

app.listen(port, () => {
    console.log('Eyyy tu app corre por el puerto ' + port);
})

app.get("/", (req, res) => {
    res.send("Hola Mundo/Hello World")
})