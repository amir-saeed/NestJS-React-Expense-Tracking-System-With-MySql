import { InputType, Field, Float, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, MaxLength, IsUUID } from 'class-validator';

@InputType()
export class UpdateExpenseInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'ID is required' })
  @IsUUID(4, { message: 'ID must be a valid UUID' })
  @ApiProperty({
    description: 'The ID of the expense to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Title must be at most 100 characters' })
  @ApiProperty({
    description: 'The updated title of the expense',
    example: 'Grocery Shopping',
    maxLength: 100,
    required: false,
  })
  title?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Amount must be a valid number' })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @ApiProperty({
    description: 'The updated amount of the expense',
    example: 125.50,
    minimum: 0.01,
    required: false,
  })
  amount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The updated category of the expense',
    example: 'Food',
    required: false,
  })
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must be at most 500 characters' })
  @ApiProperty({
    description: 'Updated description for the expense',
    example: 'Weekly grocery shopping at Walmart',
    required: false,
    maxLength: 500,
  })
  description?: string;
}