const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const routes = require('./routes');
const db = require('./db/config');

const port = process.env.PORT || 8888;
const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api', routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, ()=> {
  console.log(`Api corriendo en puerto no. ${port}`);
});
