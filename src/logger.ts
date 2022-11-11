import winston, { Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger: Logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: {
    env: process.env.NODE_ENV
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(
          (info) =>
            `${info.timestamp} ${info.level} [${info.scope || 'Server'}]: ${
              info.message
            }`
        )
      )
    }),
    new DailyRotateFile({
      dirname: '/var/log/nodana',
      filename: 'nodana-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '7d'
    })
  ]
});

export { logger, Logger as LoggerType };
