const {InfluxDB} = require('@influxdata/influxdb-client')
const {Point} = require('@influxdata/influxdb-client')

// You can generate a Token from the "Tokens Tab" in the UI
const token = 'YVM5xBPW5Xz9o9sxl8rZNKIq00lN62Ci1AuYCxsbP7MnK_1jq9v6a9HOgnieIdyxc8ubd9iSqIIqvcR_3lmwRg=='
const org = 'influx'
const bucket = 'influx'

const client = new InfluxDB({url: 'http://influxdb:8086', token: token})

module.exports = {
    async createData(request, response) {

        const writeApi = client.getWriteApi(org, bucket)
        writeApi.useDefaultTags({host: '1'})
        
        const point = new Point('temperature')
          .floatField('data', 35)
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

        return response.status(400).json({
                msg: 'Novo ponto inserido',
            });
    },

    async getLatestData(request,response) {

        const data = NULL;

        return response.status(400).json({
            msg: 'Dado mais novo retornado',
            data: data
        })
    },

    async teste(request,response) {
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
            msg: 'Dado mais novo retornado',
            data: rows
        })

    }

}