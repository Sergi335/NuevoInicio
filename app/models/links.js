const mongoose = require('mongoose')

const LinkSchema = new mongoose.Schema({
  name: {
    type: String
  },
  URL: {
    type: String
  },
  imgURL: {
    type: String
  },
  escritorio: {
    type: String
  },
  panel: {
    type: String
  },
  idpanel: {
    type: String
  },
  orden: {
    type: Number
  },
  user: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true,
  versionKey: false
})

LinkSchema.index({ name: 'text' })

module.exports = mongoose.model('links', LinkSchema)
