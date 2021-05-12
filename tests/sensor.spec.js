const request = require('supertest');
const app = require('../src/app');

// Sensor feature
describe('Sensor CRUD', () => {
  it('should register new sensor datas successfully', async (done) => {
    const response = await request(app)
      .post('/sensor/newpoints')
      .send({
        datas: [{
          id: '1',
          type: 'temperature',
          filed: 'linha',
          value: 12,
        }, {
          id: '2',
          type: 'temperatre',
          filed: 'camara',
          value: 22,
        }, {
          id: '3',
          type: 'temperatre',
          filed: 'camara',
          value: 23,
        }, {
          id: '4',
          type: 'pressure',
          filed: 'camara',
          value: 1000,
        }, {
          id: '5',
          type: 'pressure',
          filed: 'camara',
          value: 1002,
        }, {
          id: '6',
          type: 'radiation',
          filed: 'camara',
          value: 0,
        }],
      });

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('Novos pontos inseridos');
    done();
  });

  it('should return all latest sensor datas successfully', async (done) => {
    const response = await request(app)
      .get('/sensor/index');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    done();
  });

  it('should return the latest sensor data successfully', async (done) => {
    const response = await request(app)
      .get('/sensor/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    done();
  });

  it('should return the mean of sensor datas by location successfully', async (done) => {
    const response = await request(app)
      .get('/sensor/getmeans');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    done();
  });

});
