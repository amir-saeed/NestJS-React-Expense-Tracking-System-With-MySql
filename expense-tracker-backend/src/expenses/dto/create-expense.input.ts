import { InputType, Field, Float } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, MaxLength } from 'class-validator';

@InputType()
export class CreateExpenseInput {
  @Field()
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MaxLength(100, { message: 'Title must be at most 100 characters' })
  @ApiProperty({
    description: 'The title of the expense',
    example: 'Grocery Shopping',
    maxLength: 100,
  })
  title: string;

  @Field(() => Float)
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Amount must be a valid number' })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @ApiProperty({
    description: 'The amount of the expense',
    example: 125.50,
    minimum: 0.01,
  })
  amount: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The category of the expense',
    example: 'Food',
    required: false,
  })
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must be at most 500 characters' })
  @ApiProperty({
    description: 'Additional description for the expense',
    example: 'Weekly grocery shopping at Walmart',
    required: false,
    maxLength: 500,
  })
  description?: string;
}