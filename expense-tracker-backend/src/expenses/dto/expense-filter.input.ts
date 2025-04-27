import { InputType, Field, Float } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsDate, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class ExpenseFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filter expenses by title (case-insensitive partial match)',
    example: 'Grocery',
    required: false,
  })
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filter expenses by category (exact match)',
    example: 'Food',
    required: false,
  })
  category?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Filter expenses with amount greater than or equal to this value',
    example: 50,
    required: false,
  })
  minAmount?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Filter expenses with amount less than or equal to this value',
    example: 100,
    required: false,
  })
  maxAmount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'Filter expenses created on or after this date',
    example: '2023-07-01',
    required: false,
  })
  startDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'Filter expenses created on or before this date',
    example: '2023-07-31',
    required: false,
  })
  endDate?: Date;

  @Field({ nullable: true, defaultValue: 'createdAt' })
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Field to sort by',
    example: 'createdAt',
    default: 'createdAt',
    required: false,
    enum: ['title', 'amount', 'category', 'createdAt'],
  })
  orderBy?: string;

  @Field({ nullable: true, defaultValue: 'DESC' })
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Sort direction',
    example: 'DESC',
    default: 'DESC',
    required: false,
    enum: ['ASC', 'DESC']
  })
  order?: 'ASC' | 'DESC';

  @Field({ nullable: true, defaultValue: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @ApiProperty({
    description: 'Number of items to return',
    example: 10,
    default: 10,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  limit?: number;

  @Field({ nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Number of items to skip',
    example: 0,
    default: 0,
    required: false,
    minimum: 0,
  })
  offset?: number;
}