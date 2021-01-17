const bodyParser = require('body-parser');
const express = require('express');
const { PORT } = process.env;
const routes = require('./routes');

/**
 * SERVER 
 */

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);


const port = PORT || '3000';
app.listen(port, () => console.log(`Service: ${process.env.npm_package_name}. Running on port ${port}`));