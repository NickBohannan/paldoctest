const winston = require('winston')
require('winston-daily-rotate-file')

let transport = new (winston.transports.DailyRotateFile)({
    filename: 'logs/portal-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxFiles: '180d'
})

const logger = winston.createLogger({
    transports: [
        transport
    ]
})

module.exports = logger