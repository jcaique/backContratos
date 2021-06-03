const express = require('express')
const rota = express.Router();
const { check, validationResult } = require('express-validator');

const Contrato = require('../model/Contrato')

//Obter todos os contratos 
rota.get('/', async (req, res) => {
    try {
        const contratos = await Contrato.find()

        if (contratos.length === 0) {
            return res.status(404).json({
                message: 'Não há contratos registrados.'
            })
        }

        return res.status(200).json({
            quantidade: `${contratos.length}`,
            contratos
        })
    } catch (error) {
        return res.status(500).send({
            message: 'Erro ao listar contratos.',
            erro: ` ${error}`
        })
    }
})

//Obter contratos por cidade
rota.get('/municipio/:municipio', async (req, res) => {
    const pMunicipio = req.params.municipio

    try {
        let contratos = await Contrato.find({ municipio: pMunicipio })

        if (contratos.length === 0)
            return res.status(404).json({
                message: 'Não há contratos cadastrados para este município.',
                municipio: `${pMunicipio}`
            })

        return res.status(200).json({
            total: `${contratos.length}`,
            contratos
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao obter contratos',
            erro: `${error}`
        })
    }
})

//Obter contratos por empresa
rota.get('/empresa/:empresa', async (req, res) => {

    const _empresa = req.params.empresa

    try {
        const contratos = await Contrato.find({ empresa: _empresa })

        if (contratos.length === 0) {
            return res.status(404).json({
                message: 'Não há contratos registrados para essa empresa.',
                empresa: _empresa
            })
        }

        return res.status(200).json(contratos)
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao obter contratos por empresa.',
            erro: `${error}`
        })
    }
})

//Contrato por seu id
rota.get('/id/:_id', async (req, res) => {
    const _id = req.params._id;

    try {
        const contrato = await Contrato.findById({ _id: _id });

        if (contrato.length === 0) {
            return res.status(404).json({
                message: 'Contrato não encontrado.',
                id: `${_id}`
            })
        }

        return res.status(200).json(contrato);
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao solicitar contrato.',
            erro: `${error}`
        })
    }
})

//incluir um contrato
const validaContatro = [
    check('dataInicial', 'dtInicial Precisa ser uma data valida.').isDate(),
    check('dataFinal', 'dtFinal Precisa ser uma data valida.').isDate(),
    check('empresa', 'Empresa precisa ser valida.').matches(/^[A-Za-z\s]+$/),
    check('municipio', 'Municipio precisa ser válido.').matches(/^[A-Za-z\s]+$/),
    check('orgao', 'Orgão precisa ser PM ou CM.').isIn(['PM', 'CM']),
    check('valorMensal', 'Valor precisa ser numerico.').isNumeric(),
]

rota.post('/', validaContatro, async (req, res) => {
    const erros = validationResult(validaContatro)

    if (!erros.isEmpty()) {
        return res.status(400).json({
            errors: erros.array()
        })
    }

    if (Date.parse(req.body.dataFinal) < Date.parse(req.body.dataInicial)) {
        return res.status(400).json({
            message: 'Data final inferior a data inicial.',
        })
    }

    try {
        let contrato = new Contrato(req.body)
        await contrato.save();

        return res.status(200).json({
            message: 'Contrato incluído com sucesso.'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao incluir contrato.',
            erro: `${error}`
        })
    }
})

module.exports = rota;