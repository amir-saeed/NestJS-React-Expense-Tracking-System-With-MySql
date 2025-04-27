import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, MaxLength } from 'class-validator';

@InputType()
export class CreateExpenseInput {
  @Field()
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MaxLength(100, { message: 'Title must be at most 100 characters' })
  title: string;

  @Field(() => Float)
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Amount must be a valid number' })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must be at most 500 characters' })
  description?: string;
}