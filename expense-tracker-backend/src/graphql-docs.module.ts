import { Module } from '@nestjs/common';
import { GraphQLDocsController } from './controllers/graphql-docs.controller';

@Module({
  controllers: [GraphQLDocsController],
})
export class GraphQLDocsModule {}