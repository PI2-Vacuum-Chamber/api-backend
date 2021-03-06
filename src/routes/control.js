const { Router } = require('express');
const ControlControllers = require('../controllers/ControlControllers')

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ msg: 'hello controls' });
});

routes.post('/start', ControlControllers.start);
routes.post('/finish/:id', ControlControllers.finish);
routes.post('/abort/:id', ControlControllers.abort);
routes.get('/index', ControlControllers.index);
routes.get('/:id', ControlControllers.read);

module.exports = routes;
