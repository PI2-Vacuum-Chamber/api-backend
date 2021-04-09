import express from 'express';
import { createServer } from 'http';
import path from 'path';
import ejs from 'ejs';
import routes from './routes';

class App {
  constructor() {
    this.server = express();
    this.app = createServer(this.server);
    // this.middlewares();
    this.routes();
  }

  // middlewares() {
  //   this.server.use(express.json());
  //   this.server.use(express.urlencoded({ extended: true }));

  //   this.server.use(express.static(path.join(__dirname, 'public')));
  //   this.server.set('views', path.join(__dirname, 'public'));
  //   this.server.engine('html', ejs.renderFile);
  //   this.server.set('view engine', 'html');
  // }

  routes() {
    this.server.use(routes);
  }
}

export default new App().app;
