const mongoose = require("mongoose")
const validate = require("mongoose-validator")

const validaObjeto = [
    validate({
        validator: 'isLength',
        arguments: {
            max: 2000
        }
    })
]

const ContratoSchema = new mongoose.Schema({
    empresa: {
        type: String,
        required: true,
        uppercase: true
    },
    municipio: {
        type: String,
        required: true,
        uppercase: true
    },
    orgao: {
        type: String,
        required: true,
        uppercase: true,
        enum: ["PM", "CM"]
    },
    dataInicial: {
        type: Date,
        required: true
    },
    dataFinal: {
        type: Date,
        required: true
    },
    valorMensal: {
        type: Number,
        required: true
    },
    objeto: {
        type: String,
        validator: validaObjeto
    }
}, { timestamps: true })


module.exports = mongoose.model('contrato', ContratoSchema);