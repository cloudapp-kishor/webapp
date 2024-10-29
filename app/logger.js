const { createLogger, format, transports } = require("winston");
const StatsD = require("hot-shots");
require('dotenv').config({ path: '../.env' });

const statsdClient = new StatsD({ host: 'localhost', port: 8125 });

let filePath = process.env.ENVIORNMENT === "localdev" ? "logs/myapp.log" : "/var/log/myapp.log";

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  level: "debug",
  transports: [
    new transports.Console(),
    new transports.File({
      filename: filePath,
    }),
  ],
});

const logWithMetrics = (level, message) => {
  statsdClient.increment(`logs.${level}`);
  logger.log({ level, message });
};

module.exports = {
  logWithMetrics,
  logger
};
