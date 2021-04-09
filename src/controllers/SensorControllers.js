const {InfluxDB} = require('@influxdata/influxdb-client')
const {Point} = require('@influxdata/influxdb-client')

// You can generate a Token from the "Tokens Tab" in the UI
const token = '-qorGm5pjQYlxlC3HdXvln9DZqC44llOGkUXGN7_NoGwFuY0fNM2u9W1pP3zmyLfhC8B49Ob5XWnNzkofFKsIg=='
const org = 'influx'
const bucket = 'influx'

const client = new InfluxDB({url: 'http://influxdb:8086', token: token})

module.export = {
    async createData(request, response) {

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
    }
}