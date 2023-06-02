const { escritoriosModel, usersModel } = require('../models/index')
const { linksModel } = require('../models/index')
const { columnasModel } = require('../models/index')

const displayUserProfile = async (req, res) => {
  let locals
  res.render('profile.pug', locals)
}

module.exports = { displayUserProfile }
