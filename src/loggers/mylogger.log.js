"use strict";
const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
const { v4: uuidv4 } = require("uuid");

class MyLogger {
  constructor() {
    const formatPrint = format.printf(
      ({
        level,
        message,
        context = "N/A",
        requestId = "N/A",
        timestamp,
        metadata = {},
      }) => {
        return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(
          metadata
        )}`;
      }
    );

    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS A" }),
        formatPrint
      ),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          dirname: "src/logs",
          filename: "application-%DATE%.info.log",
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true, // true: backup log zipped
          maxSize: "1m", // file size
          maxFiles: "14d", // xoa log sau 14 ngày
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS A" }),
            formatPrint
          ),
          level: "info"
        }),
        new transports.DailyRotateFile({
          dirname: "src/logs",
          filename: "application-%DATE%.error.log",
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          maxSize: "1m",
          maxFiles: "14d",
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS A" }),
            formatPrint
          ),
          level: "error"
        }),
      ],
    });
  }

  commonParams(params) {
    let context, req, metadata;
    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }

    const requestId = req?.requestId || uuidv4();

    return {
      requestId,
      context,
      metadata,
    };
  }

  log(message, params) {
    const paramsLog = this.commonParams(params);
    const logObject = { message: message, ...paramsLog };
    this.logger.info(logObject);
  }

  error(message, params) {
    const paramsLog = this.commonParams(params);
    const logObject = { message: message, ...paramsLog };
    this.logger.error(logObject);
  }
}

module.exports = new MyLogger();
