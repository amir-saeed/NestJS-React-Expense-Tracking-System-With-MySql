import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';

export interface GqlContext {
  req: Request;
  res: Response;
  startTime: number;
}

export function createGqlContext({ req, res }: { req: Request; res: Response }): GqlContext {
  const logger = new Logger('GraphQLContext');
  const startTime = Date.now();
  
  // Log incoming GraphQL requests
  logger.log(`GraphQL Request: ${req.body?.operationName || 'Unnamed Operation'}`);
  
  // Add response listener to log execution time
  res.on('finish', () => {
    const executionTime = Date.now() - startTime;
    logger.log(
      `GraphQL Response: ${req.body?.operationName || 'Unnamed Operation'} - ${
        res.statusCode
      } - ${executionTime}ms`,
    );
  });
  
  return { req, res, startTime };
}

// Formatters for GraphQL errors
export const formatError = (error: any) => {
  const logger = new Logger('GraphQLError');
  
  // Log the error
  logger.error(`GraphQL Error: ${error.message}`, error.stack);
  
  // Remove sensitive information in production
  if (process.env.NODE_ENV === 'production') {
    return {
      message: error.message,
      extensions: {
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      },
    };
  }
  
  // Return detailed error in development
  return error;
};