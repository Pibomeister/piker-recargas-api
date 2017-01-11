const mongoose = require('mongoose');

let recargaSchema = mongoose.Schema({
  number: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
      type: Number,
      required: true,
      trim: true
  },
  userId: String,
  date: String
});

recargaSchema.pre('save', function(next){
  now = new Date();
  this.date= now.toString();
  next();
});

module.exports = mongoose.model('Recarga', recargaSchema);
