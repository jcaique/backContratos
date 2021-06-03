const express = require("express");
const rota = express.Router();
const { check, validationResult } = require("express-validator");

const Municipio = require("../model/Municipio")

rota.get('/', async (req, res) => {
    try {

        const municipios = await Municipio.find();
        
        return res.status(200).json(municipios);
    } catch (error) {
        res.status(500).send({
             message: 'Erro ao listar municipios.',
             erro: `${error}`
        });
    }
})


const validaMunicipio = [
    check("nome", "Nome obrigatorio.").not().isEmpty(),
    check("nome", "Numero maximo de caracteres é 30.").isLength({
        max: 30
    }),
    check("nome", "Nome precisa ser válido.").matches(/^[A-Za-z\s]+$/)
]

rota.post('/', validaMunicipio, async (req, res) => {
    //verificando se há erros na requisição com base no validaEmpresa
    const erros = validationResult(req);

    //verificando se há a const erros contém erros, se sim, retorne esses erros pls
    if (!erros.isEmpty()) {
        return res.status(400).json({
            erros: erros.array()
        })
    }

    //verificando se o municipio já está cadastrado
    const nome = req.body.nome
    let municipio = await Municipio.findOne({ nome })
    if (municipio) {
        return res.status(400).json({
              message: "Já existe um município cadastrado com esse nome!"
        })
    }
    
    try {
        let municipio = new Municipio(req.body);
        await municipio.save();

        return res.status(200).json({
            message: 'Municipio incluido com sucesso.',
            municipio
        });
    } catch (error) {
        return res.status(500).json({
            message : `Houve um erro ao salvar o municipio.`,
            erro: `${error}`
        })
    }
})

module.exports = rota