const { Router } = require('express');
const SensorControllers = require('../controllers/ControlControllers')

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ msg: 'hello controls' });
});

routes.post('/start', SensorControllers.start);
routes.post('/finish', SensorControllers.finish);
routes.post('/abort', SensorControllers.abort);

module.exports = routes;
