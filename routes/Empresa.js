const express = require('express');
const rota = express.Router();
const { check, validationResult } = require('express-validator');

const Empresa = require('../model/Empresa');

//método GET '/empresas/' - Lista todas as empresas
rota.get('/', async (req, res) => {
  try {
    const empresas = await Empresa.find();

    if (empresas.length === 0)
      return res.status(400).json({ message : 'Ainda não há empresas cadastradas.'});

    return res.status(200).json(empresas);

  } catch (error) {
    return res.status(500).json({ 
      message: 'Erro ao listar empresas.',
      erro: `${error}` 
    });
  }
});

//método GET '/empresas/cnpj' - Lista uma empresa de um determinado cnpj
rota.get('/cnpj/:cnpj', async (req, res) => {
  try {
    const _pCnpj = req.params.cnpj
    const empresa = await Empresa.findOne({ cnpj: _pCnpj });

    if (!empresa) {
      return res.status(400).json({ message: 'Cnpj informado não encontrado.' })
    }

    return res.status(200).json(empresa);

  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao solicitar empresa por cnpj.',
      erro: ` ${error.message}`
    });
  }
});

//método POST '/empresa' - Para incluir uma nova empresa
const validaEmpresa = [
  check('nome', 'Voce precisa informar o nome.').not().isEmpty(),
  check('cnpj', 'O cnpj precisa de tamanho igual a 14.').isLength({
    min: 14,
    max: 14
  }),
  check('cnpj', 'O cnpj precisa ser numerico.').isNumeric()
];

rota.post('/', validaEmpresa, async (req, res) => {
  const errors = validationResult(req);

  //Verificando se há erros
  if (!errors.isEmpty()) {
    return res.status(400).json({
      erros: errors.array()
    });
  }

  //Verifica se a empresa já existe
  const _cnpj = req.body.cnpj;
  let empresa = await Empresa.findOne({ cnpj: _cnpj });
  if (empresa) {
    return res.status(400).json({
      message: 'Já existe uma empresa com este cnpj.'
    });
  }

  try {
    //Inserindo a empresa
    let empresa = new Empresa(req.body);
    await empresa.save();

    return res.status(200).json({
      message: 'Empresa inlcuída com sucesso.',
      nomeEmpresa: `${empresa.nome}`,
      cnpj: `${empresa.cnpj}`
    });

  } catch (error) {
    return res.status(500).json({
         message: 'Erro ao incluir empresa.',
         erro: `${error.message}`
    });
  }
});

//PUT '/empresas/:cnpj' - Altera os dados de uma empresa
rota.put('/cnpj/:cnpj', validaEmpresa, async (req, res) => {
  const errors = validationResult(req);
  //cnpj para fazer a busca no banco, pega do parametro que está sendo passado.
  let cnpjAlteracao = req.params.cnpj;
  let novoCnpj = req.body.cnpj;

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  //Fazendo uma busca no banco para ver se existe o cnpj informado
  let empresa = await Empresa.findOne({ cnpj: cnpjAlteracao })
  if (!empresa) {
    return res.status(404).json({
        message: 'Cnpj informado para ser alterado não encontrado.'
      });
  }

  //Verificando se o novo cnpj já existe
  empresa = await Empresa.findOne({ cnpj: novoCnpj })
  if (empresa && (novoCnpj != cnpjAlteracao)) {
    return res.status(400).json({
        message: 'Cnpj informado para alteração já existe.',
        empresaExistente: `${empresa.nome}`,
        cnpj: `${empresa.cnpj}`
      })
  }

  //_nome e _cnpj recebem do corpo da requisição o que será atualizado na empresa
  let _nome = req.body.nome;
  let _cnpj = req.body.cnpj;
  await Empresa.findOneAndUpdate(
    { cnpj: cnpjAlteracao },
    {
      $set: {
        nome: _nome,
        cnpj: _cnpj
      }
    },
    { new: true }
  )

    .then((empresa) => {
      return res.status(200).json({
        message: 'Empresa atualizada com sucesso.',
        cnpj: `${empresa.cnpj}`,
        nome: `${empresa.nome}`
      });
    })

    .catch((error) => {
      return res.status(500).json({
        message: 'Erro ao alterar.',
        erro: `${error}`
      });
    });
});

//método DELETE '/'  - Delete uma empresa
rota.delete('/cnpj/:cnpj', async (req, res) => {
  const _cnpj = req.params.cnpj;

  let empresa = await Empresa.findOne({ cnpj: _cnpj })
  if (!empresa) {
    return res.status(404).json({
        message: 'Cnpj informado não encontrado.',
        cnpjInformado: `${_cnpj}`
      });
  }

  await Empresa.findOneAndRemove({ cnpj: _cnpj })
    .then((empresa) => {
      return res.status(200).json({
        message: 'Empresa removida com sucesso.',
        empresaNome: `${empresa.nome}`,
        cnpj: `${empresa.cnpj}`
      });
    })

    .catch((error) => {
      return res.status(500).json({
        message: 'Erro ao remover.',
        erro: `${error}`
      });
    });
});

module.exports = rota