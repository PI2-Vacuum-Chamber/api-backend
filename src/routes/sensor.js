const { Router } = require('express');
const SensorControllers = require('../controllers/SensorControllers')

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ msg: 'hello sensors' });
});

routes.get('/index', SensorControllers.index);
routes.post('/newpoints', SensorControllers.insertDatas);
routes.get('/:id', SensorControllers.getLatestData);

module.exports = routes;
