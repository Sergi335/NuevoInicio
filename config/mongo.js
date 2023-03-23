const mongoose = require("mongoose")

const dbConnect = () => {
    const DB_URI = process.env.DB_URI;
    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((res) => {
            console.log('***** CONEXION CORRECTA *****');
    }).catch((err) => {
            console.log('***** ERROR DE CONEXION *****');
    })
};

module.exports = dbConnect