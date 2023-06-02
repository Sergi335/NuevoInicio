const { escritoriosModel, usersModel } = require('../models/index')
const { linksModel } = require('../models/index')
const { columnasModel } = require('../models/index')

const displayUserProfile = async (req, res) => {
  const user = req.user.name
  const escritorios = await escritoriosModel.find({ user }).sort({ orden: 1 })
  const locals = {
    user,
    escritorios
  }
  res.render('profile.pug', locals)
}

module.exports = { displayUserProfile }
