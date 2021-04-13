const { Router } = require('express');
const SensorControllers = require('./controllers/SensorControllers')

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ msg: 'hello word' });
});

module.exports = routes;
