import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { join } from 'path';

export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Test1234',
  database: process.env.DB_NAME || 'expense_tracker',
  models: [join(__dirname, '..', '**', '*.model.{ts,js}')],
  autoLoadModels: true,
  synchronize: true, // Auto-create database schema (don't use in production)
  logging: true, // SQL logs
};