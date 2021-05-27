const mongoose = require("mongoose")
const validate = require("mongoose-validator")
//Criando o schema do banco de municipios

const MunicipioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        uppercase: true,
        unique: true
    }
}, {timestamps : true}) //para registrar data e hora do registro

module.exports = mongoose.model('municipio', MunicipioSchema)
