const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 8888;
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost/recargas');

const db = mongoose.connection;

db.on('error', err => {
  console.log('Error conectando con la base de datos', err);
});

db.on('open', () => {
  console.log('Conectado a base de datos.');
});

app.use('/api', routes);

app.listen(port, ()=> {
  console.log(`Api corriendo en puerto no. ${port}`);
});
