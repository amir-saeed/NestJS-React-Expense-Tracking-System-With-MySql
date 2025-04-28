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
  
  logger.log(`GraphQL Request: ${req.body?.operationName || 'Unnamed Operation'}`);
  
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

export const formatError = (error: any) => {
  const logger = new Logger('GraphQLError');
  
  // Log the error
  logger.error(`GraphQL Error: ${error.message}`, error.stack);
  
  if (process.env.NODE_ENV === 'production') {
    return {
      message: error.message,
      extensions: {
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      },
    };
  }

  return error;
};