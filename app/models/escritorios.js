const mongoose = require("mongoose")

const DesktopSchema = new mongoose.Schema({
    name: {
        type: String
    },
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("escritorios", DesktopSchema)