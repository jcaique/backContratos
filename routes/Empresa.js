const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Empresa = require("../model/Empresa");

//método GET "/empresas/" - Lista todas as empresas
router.get("/", async (req, res) => {
  try {
    const empresas = await Empresa.find();
    res.json(empresas);
  } catch (error) {
    res.status(500).send({
      errors: [{ message: "Não foi possivel listar as Empresas!" }]
    });
  }
});

//método GET "/empresas/id" - Lista uma empresa de um determinado id
router.get("/:id", async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    res.json(empresa);
  } catch (error) {
    res.status(500).send({
      errors: [
        {
          message: `A empresa com o id ${req.params.id} solicitada, não foi encontrada!`
        }
      ]
    });
  }
});

//método POST "/empresa/" - Para incluir uma nova empresa
const validaEmpresa = [
  check("nome", "Informe um nome com no máx 100 caracteres").not().isEmpty(),
  check("cnpj", "O cnpj precisa ser numérico").not().isNumeric(),
  check("cnpj", "O cnpj precisa de tamanho igual a 14").isLength({
    min: 14,
    max: 14
  })
];

router.post("/", validaEmpresa, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //errors está vazio? sim, entao não execute. não, entao execute.
    return res.status(400).json({
      errors: errors.array()
    });
  }

  //verificar se a empresa já existe
  const cnpj = req.body;
  let empresa = await Empresa.findOne({ cnpj });

  if (empresa)
    return res
      .status(200)
      .json({ erros: [{ message: "Já existe uma empresa com este cnpj" }] });

  try {
    let empresa = new Empresa(req.body);
    await empresa.save();
    res.send(empresa);
  } catch (error) {
    return res.status(500).json({
      errors: [
        { message: `Houve erro ao salvar a categoria! ${error.message}` }
      ]
    });
  }
});

//PUT "/empresas" - Altera os dados de uma empresa
router.put("/", validaEmpresa, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  let dados = req.body;
  await Empresa.findByIdAndUpdate(
    req.body._id,
    {
      $set: dados
    },
    { new: true }
  )
    .then((empresa) => {
      res.send({ message: `Empresa ${empresa.nome} alterada com sucesso!` });
    })
    .catch((error) => {
      return res.status(500).send({
        errors: [
          {
            message: `Não foi possivel alterar a empresa com o id ${req.body._id}`
          }
        ]
      });
    });
});

//método DELETE "/"  - Delete uma empresa
router.delete("/", async (req, res) => {
  await Empresa.findByIdAndRemove(req.params.id)
    .then((empresa) => {
      res.send({ message: `Empresa ${empresa.nome} removida com sucesso!` });
    })
    .catch((error) => {
      return res.status(500).send({
        errors: [
          {
            message: `Não foi possivel remover a categoria com o id ${req.params.id}`
          }
        ]
      });
    });
});

module.exports = router;
