import { IsNumber, IsString, IsOptional, Min, validateSync } from 'class-validator';
import { Transform, plainToClass } from 'class-transformer';

export class EnvironmentVariables {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  PORT: number = 3000;

  @IsString()
  @IsOptional()
  DB_HOST: string = 'localhost';

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  DB_PORT: number = 3306;

  @IsString()
  @IsOptional()
  DB_USER: string = 'root';

  @IsString()
  @IsOptional()
  DB_PASSWORD: string = 'Test1234';

  @IsString()
  @IsOptional()
  DB_NAME: string = 'expense_tracker';
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  
  return validatedConfig;
}