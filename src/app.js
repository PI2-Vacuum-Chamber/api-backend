import express from 'express';
import { createServer } from 'http';
import path from 'path';
import ejs from 'ejs';
import routes from './routes';
const {InfluxDB} = require('@influxdata/influxdb-client')

// You can generate a Token from the "Tokens Tab" in the UI
const token = '-qorGm5pjQYlxlC3HdXvln9DZqC44llOGkUXGN7_NoGwFuY0fNM2u9W1pP3zmyLfhC8B49Ob5XWnNzkofFKsIg=='
const org = 'influx'
const bucket = 'influx'

const client = new InfluxDB({url: 'http://influxdb:8086', token: token})

const {Point} = require('@influxdata/influxdb-client')
const writeApi = client.getWriteApi(org, bucket)
writeApi.useDefaultTags({host: 'host1'})

const point = new Point('mem')
  .floatField('used_percent', 23.43234543)
writeApi.writePoint(point)
writeApi
    .close()
    .then(() => {
        console.log('FINISHED')
    })
    .catch(e => {
        console.error(e)
        console.log('\\nFinished ERROR')
    })

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
