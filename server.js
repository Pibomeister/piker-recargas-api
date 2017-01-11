const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const db = require('./db/config');
const port = process.env.PORT || 8888;
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.use('/api', routes);

app.listen(port, ()=> {
  console.log(`Api corriendo en puerto no. ${port}`);
});
