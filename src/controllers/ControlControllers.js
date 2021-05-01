const {InfluxDB} = require('@influxdata/influxdb-client')
const {Point} = require('@influxdata/influxdb-client')
require('dotenv/config');

// You can generate a Token from the "Tokens Tab" in the UI
const token = process.env.TOKEN
const org = 'influx'
const bucket = 'influx'

const client = new InfluxDB({url: 'http://influxdb:8086', token: token})

module.exports = {

    async start(request,response) {

        try {
            console.log('Experimento iniciado.')
            return response.status(200).json({
                msg: 'Experimento iniciado'
            })
        } catch (error) {
            return response.status(500).json({
                msg: 'Erro ao iniciar experimento'
            });
        }

    },

    async finish(request, response) {
        
        try {
            console.log('Experimento finalizado.')
            return response.status(200).json({
                msg: 'Experimento finalizado'
            })
        } catch (error) {
            return response.status(500).json({
                msg: 'Erro ao finalizar o experimento'
            });
        }
    },

    async abort(request,response) {

        try {
            console.log('Parada de emergência realizada com sucesso.')
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