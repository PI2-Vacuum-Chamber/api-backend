const express = require('express');
const { createServer } = require('http');
const path = require('path');
const ejs = require('ejs');
const routes = require('./routes');
const sensorRoutes = require('./routes/sensor');
const controlRoutes = require('./routes/control');

const app = express();

app.use(express.json());

app.use(routes);
app.use('/sensor', sensorRoutes);
app.use('/control', controlRoutes);

module.exports = app;
