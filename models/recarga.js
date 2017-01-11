const mongoose = require('mongoose');

let recargaSchema = mongoose.Schema({
  number: String,
  amount: Number,
  userId: String,
  date: String
});

recargaSchema.pre('save', function(next){
  now = new Date();
  this.date= now.toString();
  next();
});

module.exports = mongoose.model('Recarga', recargaSchema);
