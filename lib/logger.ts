import path from 'path'
import pino from 'pino'

const logsPath = path.resolve('src', 'logs')

const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: `${logsPath}/server.log` },
      level: process.env.PINO_LOG_LEVEL || 'info',
    },
    //@ts-ignore
    {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  ],
})

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',

    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport,
)

export { logger }
