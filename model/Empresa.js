const mongoose = require("mongoose");
const validate = require("mongoose-validator");
//aqui iremos criar o schema da Empresa

const cnpjValidator = [
  validate({
    validator: "isLength",
    arguments: [14],
    message: "O cnpj precisa ser igual a 14 caracteres sem pontos"
  },
  validate({
    validator: "isNumeric",
    message: 'O cnpj precisa ser numerico'
  }))
];


const EmpresaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    uppercase: true
  },
  cnpj: {
    type: String,
    required: true,
    unique: true,
    validator: cnpjValidator
  }
}, { timestamps: true} );



module.exports = mongoose.model('empresa', EmpresaSchema);
