import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ExpensesModule } from './expenses/expenses.module';
import { sequelizeConfig } from './config/database.config';
import { createGqlContext, formatError } from './config/graphql-context.factory';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { GraphQLDocsModule } from './graphql-docs.module';
import { DatabaseMigrationService } from './services/database-migration.service';
import { DatabaseMigrationModule } from './services/database-migration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot(sequelizeConfig),

    // Configure GraphQL with automatic schema generation
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true, // Enable GraphQL playground for testing
      context: createGqlContext,
      formatError,
      installSubscriptionHandlers: true,
      introspection: true,
    }),
    ExpensesModule,
    GraphQLDocsModule,
    DatabaseMigrationModule
  ],
  providers: [
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule { }
