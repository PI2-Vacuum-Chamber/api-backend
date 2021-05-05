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

// class App {
//   constructor() {
//     this.server = express();
//     this.app = createServer(this.server);
//     // this.middlewares();
//     this.routes();
//   }

//   // middlewares() {
//   //   this.server.use(express.json());
//   //   this.server.use(express.urlencoded({ extended: true }));

//   //   this.server.use(express.static(path.join(__dirname, 'public')));
//   //   this.server.set('views', path.join(__dirname, 'public'));
//   //   this.server.engine('html', ejs.renderFile);
//   //   this.server.set('view engine', 'html');
//   // }

//   routes() {
//     this.server.use(routes);
//     this.server.use('/sensor', sensorRoutes);
//   }
// }

// export default new App().app;
