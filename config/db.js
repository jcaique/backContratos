/**
 * Uma string de conexão para o MongoDB.
 * Aqui é inicializada a conexão através 
 * da url de conexão no .env. 
 */

const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI;

const inicializaMongoServer = async () => {
  try {

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    console.log("Mongo conectado!");
  } catch (e) {
    console.error(e);
    throw e;
  }
};

module.exports = inicializaMongoServer;
