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
            const id = uuidv4();
            console.log(`Experimento ${ id } iniciado.`);

            const writeApi = client.getWriteApi(org, bucket);
            writeApi.useDefaultTags({host: id});

            // var point = [];
            // console.log(point);
            
            // point.push(new Point('experiment').floatField('checkpoint', 'start'));
            // point.push(new Point('experiment').floatField('tempMax', tempMax));
            // point.push(new Point('experiment').floatField('timeTempMax', timeTempMax));
            // point.push(new Point('experiment').floatField('tempMin', tempMin));
            // point.push(new Point('experiment').floatField('timeTempMin', timeTempMin));
            // point.push(new Point('experiment').floatField('qtdeCiclesMax', qtdeCiclesMax));
            // point.push(new Point('experiment').floatField('qtdeCiclesMin', qtdeCiclesMin));

            // console.log(point);
            // https://github.com/node-influx/node-influx/issues/297
            writeApi.writePoints(
                [
                    [{
                        measurement: 'experiment',
                        fields: {
                            name: 'checkpoint',
                            value: 'start'
                        }
                    },],[{
                        measurement: 'experiment',
                        fields: {
                            name: 'tempMax',
                            value: tempMax
                        }
                    }],[{
                        measurement: 'experiment',
                        fields: {
                            name: 'timeTempMax',
                            value: timeTempMax
                        }
                    }],[{
                        measurement: 'experiment',
                        fields: {
                            name: 'tempMin',
                            value: tempMin
                        }
                    }],[{
                        measurement: 'experiment',
                        fields: {
                            name: 'timeTempMin',
                            value: timeTempMin
                        }
                    }],[{
                        measurement: 'experiment',
                        fields: {
                            name: 'qtdeCiclesMax',
                            value: qtdeCiclesMax
                        }
                    }],[{
                        measurement: 'experiment',
                        fields: {
                            name: 'qtdeCiclesMin',
                            value: qtdeCiclesMin
                        }
                    }]
                ]
            );
            
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

            const point = new Point('experiment').floatField('chackpoint', 'finish');

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

            const point = new Point('experiment').floatField('checkpoint', 'finish');

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