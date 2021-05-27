const express = require("express")
const rota = express.Router();
const { check, validationResult } = require("express-validator");

const Contrato = require("../model/Contrato")

//Obter todos os contratos
rota.get("/", async (req, res) => {
    try {
        const contratos = await Contrato.find()
        res.json(contratos)
    } catch (error) {
        res.status(500).send({
            errors: [{ message: `Não foi possivel obter os contratos! ${error}` }]
        })
    }
})

//fazer um get de todos os contratos por cidade
rota.get("/municipio", async (req, res) => {
    const muni = req.body.municipio
    try {
        let contratos = await Contrato.find({ municipio: muni })

        if (contratos.length === 0)
            return res.status(400).json({ Message: `Não há contratos cadastrados para este município` })

        res.status(200).json(contratos)
    } catch (error) {
        return res.status(400).json({
            message: `Não foi possivel obter os contratos ${error}`
        })
    }
})

//fazer um get de todos os contratos por empresa
rota.get("/empresa", async (req, res) => {
    const empresa = req.body.empresa

    try {
        const contratos = await Contrato.find({ empresa })
        res.status(200).json(contratos)
    } catch (error) {
        return res.status(400).json({
            message: `Não foi possivel obter os contratos ${error}!`
        })
    }

})

//incluir um contrato
const validaContatro = [
    check("dataInicial", "dtInicial Precisa ser uma data valida").isDate(),
    check("dataFinal", "dtFinal Precisa ser uma data valida").isDate(),
    check("empresa", "Empresa precisa ser valida").matches(/^[A-Za-z\s]+$/),
    check("municipio", "Municipio precisa ser valido").matches(/^[A-Za-z\s]+$/),
    check("orgao", "Precisa ser pm ou cm").isIn(['PM', 'CM'])
]

rota.post('/', validaContatro, async (req, res) => {
    const erros = validationResult(validaContatro)

    if (!erros.isEmpty()) {
        return res
            .status(400)
            .json({ errors: erros.array() })
    }

    if (Date.parse(req.body.dataFinal) < Date.parse(req.body.dataInicial)) {
        return res
            .status(400)
            .json({
                erros: [{ message: `Data final inferior a data inicial!` }
                ]
            })
    }

    try {
        let contrato = new Contrato(req.body)
        await contrato.save();

        res.status(200).json({
            message: `Contrato salvo com sucesso!`
        })
    } catch (error) {
        return res.status(500).json({
            erros: [{
                message: `Erro ao incluir contrato ${error}`
            }]
        })
    }
})

module.exports = rota;