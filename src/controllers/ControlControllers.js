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

    async index(request, response) {

        try {
            const queryApi = client.getQueryApi(org)
            const query = `from(bucket: "${ bucket }")
                            |> range(start: 2020-01-01T23:30:00Z)
                            |> filter(fn: (r) => r["_field"] == "checkpoint" and r["_measurement"] == "experiment" and r["_value"] == "start")`

            const rows = await queryApi.collectRows(query);

            return response.status(200).json({
                msg: 'Todos os experimentos cadastrados',
                data: rows,
            })
        } catch (error) {
            return response.status(404).json({
                msg: 'Nenhum dado de sensores encontrados na última hora',
                data: error,
            });
        }

    },
    
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

            var points = [];
            console.log(points);

            points.push(new Point('experiment').stringField('checkpoint', 'start'));
            points.push(new Point('experiment').floatField('tempMax', tempMax));
            points.push(new Point('experiment').floatField('timeTempMax', timeTempMax));
            points.push(new Point('experiment').floatField('tempMin', tempMin));
            points.push(new Point('experiment').floatField('timeTempMin', timeTempMin));
            points.push(new Point('experiment').floatField('qtdeCiclesMax', qtdeCiclesMax));
            points.push(new Point('experiment').floatField('qtdeCiclesMin', qtdeCiclesMin));

            console.log(points);
            // https://github.com/node-influx/node-influx/issues/297
            writeApi.writePoints(points);
            
            // writeApi.writePoints(
            //     [
            //         [{
            //             measurement: 'experiment',
            //             fields: {
            //                 name: 'checkpoint',
            //                 value: 'start'
            //             }
            //         },],[{
            //             measurement: 'experiment',
            //             fields: {
            //                 name: 'tempMax',
            //                 value: tempMax
            //             }
            //         }],[{
            //             measurement: 'experiment',
            //             fields: {
            //                 name: 'timeTempMax',
            //                 value: timeTempMax
            //             }
            //         }],[{
            //             measurement: 'experiment',
            //             fields: {
            //                 name: 'tempMin',
            //                 value: tempMin
            //             }
            //         }],[{
            //             measurement: 'experiment',
            //             fields: {
            //                 name: 'timeTempMin',
            //                 value: timeTempMin
            //             }
            //         }],[{
            //             measurement: 'experiment',
            //             fields: {
            //                 name: 'qtdeCiclesMax',
            //                 value: qtdeCiclesMax
            //             }
            //         }],[{
            //             measurement: 'experiment',
            //             fields: {
            //                 name: 'qtdeCiclesMin',
            //                 value: qtdeCiclesMin
            //             }
            //         }]
            //     ]
            // );
            
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
            writeApi.useDefaultTags({host: id});

            const point = new Point('experiment').stringField('checkpoint', 'finish');

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

            const point = new Point('experiment').stringField('checkpoint', 'abort');

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

    async read(request, response) {
        const { id } = request.params;
        
        try {
            const queryApi = client.getQueryApi(org)
            const query = `from(bucket: "${ bucket }")
                            |> range(start: 2020-01-01T23:30:00Z)
                            |> filter(fn: (r) => r["_measurement"] == "experiment" and r["host"] == "${ id }")`

            const rows = await queryApi.collectRows(query);

            return response.status(200).json({
                msg: 'Todos os dados do experimento',
                data: rows,
            })
        } catch (error) {
            return response.status(404).json({
                msg: 'Não foram encontrados dados correspondentes a este experimento',
                data: error,
            });
        }

    },

}