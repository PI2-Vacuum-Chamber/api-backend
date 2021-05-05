require('dotenv/config');

const {InfluxDB} = require('@influxdata/influxdb-client')
const {Point} = require('@influxdata/influxdb-client')
const { v4: uuidv4 } = require('uuid');

// You can generate a Token from the "Tokens Tab" in the UI
const token = process.env.TOKEN
const org = 'influx'
const bucket = 'influx'

const client = new InfluxDB({url: 'http://influxdb:8086', token: token})

module.exports = {

    async start(request, response) {

        const { tempMax, timeTempMax,
                tempMin, timeTempMin,
                qtdeCiclesMax, qtdeCiclesMin
            } = request.body;

        try {
            console.log('Experimento iniciado.');

            const writeApi = client.getWriteApi(org, bucket);
            const id = uuidv4();
            const checkpoint = newDate().getTime();
            writeApi.useDefaultTags({host: id});

            var point = new Point('checkpoint').floatField('start', checkpoint);
            writeApi.writePoint(point);
            point = new Point('experiment').floatField('tempMax', tempMax);
            writeApi.writePoint(point);
            point = new Point('experiment').floatField('timeTempMax', timeTempMax);
            writeApi.writePoint(point);
            point = new Point('experiment').floatField('tempMin', tempMin);
            writeApi.writePoint(point);
            point = new Point('experiment').floatField('timeTempMin', timeTempMin);
            writeApi.writePoint(point);
            point = new Point('experiment').floatField('qtdeCiclesMax', qtdeCiclesMax);
            writeApi.writePoint(point);
            point = new Point('experiment').floatField('qtdeCiclesMin', qtdeCiclesMin);
            writeApi.writePoint(point);

            writeApi
                .close()
                .then(() => {
                    console.log('FINISHED')
                })
                .catch(e => {
                    console.error(e)
                    console.log('\\nFinished ERROR')
                });

            return response.status(200).json({
                msg: 'Experimento iniciado',
                data: id,
            })
        } catch (error) {
            return response.status(500).json({
                msg: 'Erro ao iniciar experimento'
            });
        }
    },

    async finish(request, response) {

        const { id } = request.params;
        
        try {
            console.log('Experimento finalizado.');

            const writeApi = client.getWriteApi(org, bucket);
            const checkpoint = newDate().getTime();
            writeApi.useDefaultTags({host: id});

            const point = new Point('checkpoint').floatField('finish', checkpoint);

            writeApi.writePoint(point);
            writeApi
                .close()
                .then(() => {
                    console.log('FINISHED')
                })
                .catch(e => {
                    console.error(e)
                    console.log('\\nFinished ERROR')
                });

            return response.status(200).json({
                msg: 'Experimento finalizado'
            })
        } catch (error) {
            return response.status(500).json({
                msg: 'Erro ao finalizar o experimento'
            });
        }
    },

    async abort(request, response) {

        const { id } = request.params;
        
        try {
            console.log('Parada de emergência realizada com sucesso.');

            const writeApi = client.getWriteApi(org, bucket);
            const checkpoint = newDate().getTime();
            writeApi.useDefaultTags({host: id});

            const point = new Point('checkpoint').floatField('abort', checkpoint);

            writeApi.writePoint(point);
            writeApi
                .close()
                .then(() => {
                    console.log('FINISHED')
                })
                .catch(e => {
                    console.error(e)
                    console.log('\\nFinished ERROR')
                });

            return response.status(200).json({
                msg: 'Parada de emergência realizada com sucesso.'
            })
        } catch (error) {
            return response.status(500).json({
                msg: 'Erro ao interromper o experimento'
            });
        }
    },

}