require('dotenv').config()

const express = require('express')
const path = require('path')
const dbConnect = require('./config/mongo')
const cors = require('cors')
const favicon = require('serve-favicon')
// eslint-disable-next-line n/no-path-concat
const faviconURL = `${__dirname}/public/img/favicon.ico`
const morgan = require('morgan')
// const pug = require('pug')
const routes = require('./app/routes/index')
// eslint-disable-next-line n/no-path-concat
const publicDir = express.static(path.join(`${__dirname}/public`))
// eslint-disable-next-line n/no-path-concat
const viewDir = `${__dirname}/views`
const port = (process.env.port || 3000)
const app = express()
const cookieParser = require('cookie-parser')

app
// Configurando app
  .set('views', viewDir)
  .set('view engine', 'pug')
  .set('port', port)

app
// Ejecutando middlewares
  .use(cors())
  .use(favicon(faviconURL))
  .use(express.json())
  .use(morgan('dev'))
  .use(publicDir)
  .use(cookieParser())

  .use('/', routes)
// eslint-disable-next-line n/no-path-concat
app.use('/node_modules', express.static(__dirname + '/node_modules', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript')
    }
  }
}))

app.listen(port, () => {
  console.log('Eyyy tu app corre por el puerto ' + port)
})

dbConnect()
