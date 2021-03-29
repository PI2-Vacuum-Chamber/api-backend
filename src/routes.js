import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ msg: 'hello word' });
});

export default routes;
