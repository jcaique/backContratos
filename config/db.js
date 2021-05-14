const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI;

const inicializaMongoServer = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    });
    console.log("Mongo conectado!");
  } catch (e) {
    console.error(e);
    throw e;
  }
};

module.exports = inicializaMongoServer;
