const {InfluxDB} = require('@influxdata/influxdb-client')
const {Point} = require('@influxdata/influxdb-client')

// You can generate a Token from the "Tokens Tab" in the UI
const token = '-qorGm5pjQYlxlC3HdXvln9DZqC44llOGkUXGN7_NoGwFuY0fNM2u9W1pP3zmyLfhC8B49Ob5XWnNzkofFKsIg=='
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

        const datas = request.body;

        try {
            const writeApi = client.getWriteApi(org, bucket);

            for (const position in datas) {
                writeApi.useDefaultTags({host: datas[position].id});
                
                const point = new Point(datas[position].type)
                .floatField('data', datas[position].value);
                writeApi.writePoint(point);
            }
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

        const id = request.params;
        try {
            const queryApi = client.getQueryApi(org)
            const query = `from(bucket: "influx") |> range(start: -1h) |> filter(fn: (r) => r.host == ${ id }`;
            const rows = await queryApi.collectRows(query);

            return response.status(400).json({
                msg: `Dado mais novo retornado do sensor ${ id }`,
                data: rows,
            })
        } catch (error) {
            return response.status(401).json({
                msg: 'Sensor não encontrado',
                data: error,
            });
        }
    },

}