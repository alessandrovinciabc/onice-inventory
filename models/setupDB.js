const mongoose = require('mongoose');

module.exports = function () {
  mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return mongoose.connection;
};
