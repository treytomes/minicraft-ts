import {default as pino} from 'pino';

// TODO: Work out this file transport path error.
// TODO: Log file rotation.
// const fileTransport = pino.transport({
//   target: 'pino/file',
//   options: {destination: `${__dirname}/app.log`},
// });

export default pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    formatters: {
      level: label => {
        return {level: label.toUpperCase()};
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  }
  // fileTransport
);
