import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Request, Response } from 'express';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    // Handle GraphQL context

    if (host.getType<string>() === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);
      const info = gqlHost.getInfo();

      // Log the error with context
      this.logger.error(
        `GraphQL Error in ${info.parentType}.${info.fieldName}: ${exception.message}`,
        exception.stack,
      );

      // GraphQL errors are handled differently
      if (exception instanceof GraphQLError) {
        throw exception;
      }

      // Format other errors as GraphQL errors
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new GraphQLError(exception.message || 'Internal server error', {
        extensions: {
          code: exception.code || 'INTERNAL_SERVER_ERROR',
          statusCode: status,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Handle HTTP context (for REST API and Swagger)
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message || 'Internal server error';

    // Log the error
    this.logger.error(
      `HTTP Error ${status} in ${request.method} ${request.url}: ${exception.message}`,
      exception.stack,
    );

    // Return formatted error response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === 'object' ? message : { error: message },
    });
  }
}