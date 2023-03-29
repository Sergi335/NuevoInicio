require("dotenv").config()

const express = require("express"),
      path = require("path"),
      dbConnect = require("./config/mongo"),
      cors = require("cors"),
      favicon = require("serve-favicon"),
      faviconURL = `${__dirname}/public/img/favicon.ico`,
      morgan = require("morgan"),
      pug = require("pug")
      routes = require("./app/routes/index"),
      publicDir = express.static(path.join(`${__dirname}/public`)),
      viewDir = `${__dirname}/views`,
      port = (process.env.port || 3000),
      app = express(),
      //router = express.Router()

app
    //Configurando app
     .set('views', viewDir)
     .set('view engine', 'pug')
     .set('port', port)

app
    //Ejecutando middlewares
     .use(cors())
     .use(favicon(faviconURL))
     .use(express.json())
     .use(morgan('dev'))
     .use(publicDir)
    //Ejecutando el middleware enrutador
     .use('/', routes)

app.listen(port, () => {
    console.log('Eyyy tu app corre por el puerto ' + port);
})

dbConnect()
//module.exports(app)