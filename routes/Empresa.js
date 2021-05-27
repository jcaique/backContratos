const express = require("express");
const rota = express.Router();
const { check, validationResult } = require("express-validator");

const Empresa = require("../model/Empresa");

//método GET "/empresas/" - Lista todas as empresas
rota.get("/", async (req, res) => {
  try {
    const empresas = await Empresa.find();
    res.json(empresas);
  } catch (error) {
    res.status(500).send({
      errors: [{ message: "Não foi possivel listar as Empresas!" }]
    });
  }
});

//método GET "/empresas/:cnpj" - Lista uma empresa de um determinado cnpj
rota.get("/:cnpj", async (req, res) => {
  try {
    const empresa = await Empresa.find({ cnpj: req.params.cnpj });
    res.json(empresa);
  } catch (error) {
    res.status(500).send({
      errors: [
        {
          message: `A empresa com o cnpj ${req.params.cnpj} solicitada, não foi encontrada! ${error.message}`
        }
      ]
    });
  }
});


//método POST "/empresa/" - Para incluir uma nova empresa
const validaEmpresa = [
  check("nome", "Voce precisa informar o nome").not().isEmpty(),
  //check("cnpj", "O cnpj precisa ser numérico").not().isNumeric(),
  check("cnpj", "O cnpj precisa de tamanho igual a 14").isLength({
    min: 14,
    max: 14
  }),
  check("cnpj", "O cnpj precisa ser numerico").isNumeric()
];

rota.post("/", validaEmpresa, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //errors está vazio? sim, entao não execute. não, entao execute.
    return res.status(400).json({
      errors: errors.array()
    });
  }

  //verificar se a empresa já existe
  const cnpj = req.body.cnpj; //quebrei a cabeça coloquei: cnpj = req.body
  let empresa = await Empresa.findOne({ cnpj });
  if (empresa) {
    return res
      .status(200)
      .json({ erros: [{ message: "Já existe uma empresa com este cnpj" }] });
  }

  try {
    //inserindo uma nova empresa 
    let empresa = new Empresa(req .body);
    await empresa.save();
    res.send(empresa);
  } catch (error) {
    return res.status(500).json({
      errors: [
        { message: `Houve erro ao salvar a empresa! ${error.message}` }
      ]
    });
  }
});



//PUT "/empresas" - Altera os dados de uma empresa
rota.put("/:cnpj", validaEmpresa, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  //fazendo uma busca no banco para ver se existe o cnpj informado
  let empresa = await Empresa.findOne({ cnpj : req.params.cnpj })
  if (!empresa) {
    return res //caso exista é retornado o cod de erro 200
      .status(200)
      .json({ erros: [{ message: "CNPJ informado não encontrado!" }] });
  }

  //_nome e _cnpj recebem do corpo da requisição o que será setado como novo
  let _nome = req.body.nome;
  let _cnpj = req.body.cnpj;
  let cnpjBusca = req.params.cnpj; //cnpj para fazer a busca no banco, pega do parametro que está sendo passado.

  await Empresa.findOneAndUpdate(
    { cnpj: cnpjBusca },
    {
      $set: {
        nome: _nome,
        cnpj: _cnpj
      }
    },
    {
      new: true,
    }
  )
    .then((empresa) => {
      res.send({
        message: `${empresa.nome} atualizada com sucesso!`
      });
    })
    .catch((error) => {
      return res.status(500).send({
        errors: [
          {
            message: `Não foi possivel alterar a empresa com o cnpj ${req.body.cnpj} ${error}`
          }
        ]
      });
    });
});


//método DELETE "/"  - Delete uma empresa
rota.delete("/:cnpj", async (req, res) => {
  await Empresa.findOneAndRemove(req.params.cnpj)
    .then((empresa) => {
      res.send({ message: `Empresa ${empresa.nome} removida com sucesso!` });
    })
    .catch((error) => {
      return res.status(500).send({
        errors: [
          {
            message: `Não foi possivel remover a empresae com o cnpj ${req.params.cnpj}
            ${error}`
          }
        ]
      });
    });
});

module.exports = rota