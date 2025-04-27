import { ConsoleLogger, Injectable, Scope, LogLevel } from '@nestjs/common';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger {
  private winstonLogger: winston.Logger;

  constructor(
    context: string,
    private configService: ConfigService,
  ) {
    super(context);

    // Define log format
    const format = winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      winston.format.json(),
    );

    // Configure transports based on environment
    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(({ context, level, message, timestamp }) => {
            return `${timestamp} [${level}] [${context}]: ${message}`;
          }),
        ),
      }),
    ];

    // Add file transport in production
    if (process.env.NODE_ENV === 'production') {
      transports.push(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
      );
    }

    // Create Winston logger
    this.winstonLogger = winston.createLogger({
      level: this.configService.get('LOG_LEVEL') || 'info',
      format,
      defaultMeta: { service: 'expense-tracker' },
      transports,
    });
  }

  log(message: any, ...optionalParams: any[]) {
    this.winstonLogger.info(message, { context: this.context, ...this.getMetadata(optionalParams) });
    super.log.apply(this, [message, ...optionalParams]);
  }

  error(message: any, stack?: string, ...optionalParams: any[]) {
    this.winstonLogger.error(message, { 
      context: this.context, 
      stack, 
      ...this.getMetadata(optionalParams) 
    });
    super.error.apply(this, [message, stack, ...optionalParams]);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.winstonLogger.warn(message, { context: this.context, ...this.getMetadata(optionalParams) });
    super.warn.apply(this, [message, ...optionalParams]);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.winstonLogger.debug(message, { context: this.context, ...this.getMetadata(optionalParams) });
    super.debug.apply(this, [message, ...optionalParams]);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.winstonLogger.verbose(message, { context: this.context, ...this.getMetadata(optionalParams) });
    super.verbose.apply(this, [message, ...optionalParams]);
  }

  private getMetadata(params: any[]) {
    if (params.length > 0 && typeof params[params.length - 1] === 'object') {
      return params[params.length - 1];
    }
    return {};
  }

  // Create a child logger with a specific context
  createChildLogger(context: string): AppLogger {
    const childLogger = new AppLogger(`${this.context}:${context}`, this.configService);
    return childLogger;
  }
}