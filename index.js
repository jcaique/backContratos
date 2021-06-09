const express = require("express");

require("dotenv").config();

const inicializaMongoServer = require("./config/db");

//iniciando o mongodb 
inicializaMongoServer(); 

//definindo as rotas tas aplicação
const rotasEmpresa = require("./routes/Empresa");
const rotasMunicipios = require("./routes/Municipio");
const rotasContratos = require("./routes/Contrato");

//inicializa o app a partir da biblioteca express
const app = express();

//removeno o 'x-powered-by' por segurnaça
app.disable("x-powered-by");

//porta default do backend
const PORT = process.env.PORT || 4000;

//middeware do express
app.use(function (req, res, next) {
  //em produção, remover o * e atualizar com o dominio/ip do app
  res.setHeader("Access-Control-Allow-Origin", "*");

  //cabecalhos que serao permitidos, ex: res.setHeader('Access-Control-Allow-Headers','Content-Type, Accept, access-token')
  res.setHeader("Access-Control-Allow-Headers", "*");

  //metodos que serão permitidos
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT,DELETE, OPTIONS, PATCH"
  );
  next();
});

//backend fará o parse  do json
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'API Contratos!',
    author: 'jcaique',
    version: '1.0.0'
  })
})

app.use("/empresas", rotasEmpresa);
app.use("/municipios", rotasMunicipios);
app.use("/contratos", rotasContratos);

//ROTA PARA TRATAR ERROS 404, ELA DEVE SER SEMPRE A ULTIMA ROTRA INFORMADA
app.use(function (req, res) {
  res.status(404).json({
    mensagem: `A rota ${req.baseUrl} não existe!`
  });
});

app.listen(PORT, (req, res) => {
  console.log(`Servidor web rodando na porta ${PORT}`);
});
