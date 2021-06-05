const mongoose = require('mongoose');

const uri = "mongodb+srv://admin:admin123456@cluster0.98n6c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const dbConnection = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log('Base de datos online');
  } catch (error) {
    console.log(error);
    throw new Error('Error a la hora de iniciar la base de datos');
  }
};

module.exports = {
  dbConnection,
};
