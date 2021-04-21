const {InfluxDB} = require('@influxdata/influxdb-client')
const {Point} = require('@influxdata/influxdb-client')
require('dotenv/config');

// You can generate a Token from the "Tokens Tab" in the UI
const token = process.env.TOKEN
const org = 'influx'
const bucket = 'influx'

const client = new InfluxDB({url: 'http://influxdb:8086', token: token})

module.exports = {

    async index(request,response) {

        const queryApi = client.getQueryApi(org)
        const query = 'from(bucket: "influx") |> range(start: -1h)'

        // queryApi.queryRows(query, {
        // next(row, tableMeta) {
        //     const o = tableMeta.toObject(row)
        //     console.log(
        //     `${o._time} ${o._measurement} ${o._field}=${o._value}`
        //     )
        // },
        // error(error) {
        //     console.error(error)
        //     console.log('\\nFinished ERROR')
        // },
        // complete(rows) {
        //     console.log('\\nFinished SUCCESS')
        //     console.log(rows)
        // },
        // })

        const rows = await queryApi.collectRows(query);

        return response.status(400).json({
            msg: 'Todos os dados mais novos retornados',
            data: rows,
        })

    },

    async insertDatas(request, response) {
        // { datas = [{id: 1, type: temperature, value: 22}, {id: 2, type: pressure, value: 1000}] }
        const { datas } = request.body;
        // datas = [{id: 1, type: temperature, value: 22}, {id: 2, type: pressure, value: 1000}]
        console.log(datas);

        try {
            const writeApi = client.getWriteApi(org, bucket);

            datas.forEach(data => {
                console.log(data);
                // data = {id: 1, type: temperature, value: 22}
                writeApi.useDefaultTags({host: data.id});
                const point = new Point(data.type).floatField('data', data.value);
                writeApi.writePoint(point);
                
            });
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
                msg: 'Novos pontos inseridos',
            });

        } catch(error) {
            return response.status(401).json({
                msg: 'Erro ao inserir pontos',
                data: error,
            });            
        }
    },

    async getLatestData(request,response) {

        const { id } = request.params;
        try {
            const queryApi = client.getQueryApi(org)
            const query = `from(bucket: "influx") 
                           |> range(start: -1h) 
                           |> filter(fn: (r) => r.host == "${ id }")
                           |> last(column: "_value")
                           |> yield(name: "last") `;
            console.log(query);
            const rows = await queryApi.collectRows(query);

            return response.status(200).json({
                msg: `Dado mais novo retornado do sensor ${ id }`,
                data: rows,
            })
        } catch (error) {
            return response.status(404).json({
                msg: 'Sensor não encontrado',
                data: error,
            });
        }
    },

}