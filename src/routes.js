import { Router } from 'express';
const SensorControllers = require('./controllers/SensorControllers')

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ msg: 'hello word' });
});

routes.get('/newpoint', SensorControllers.createData());

export default routes;
