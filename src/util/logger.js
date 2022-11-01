const winston = require('winston');
const dateFormat = require('dateformat')
const DailyRotateFile = require('winston-daily-rotate-file')
const now = new Date();

const date = dateFormat(now, "yyyy/mm/dd HH:MM:ss");

const logger = winston.createLogger({
    level: "info",
    format: winston.format.printf(log =>{
        return `${date}. ${log.level.toUpperCase()}: ${log.message}`
    }),
    transports :[
        new winston.transports.Console({}),
        new DailyRotateFile({
            filename: "log_all-%DATE%.log",
            zippedArchive: true,
            datePattern: 'yyyy-MM',
            maxSize: "3m",
            maxFiles: "30d"
        }),
        new DailyRotateFile({
            level: "error",
            filename: "log_error-%DATE%.log",
            zippedArchive: true,
            datePattern: 'yyyy-MM',
            maxSize: "1m",
            maxFiles: "30d"
        }),
    ]
});

module.exports = logger;