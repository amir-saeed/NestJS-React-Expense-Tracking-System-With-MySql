import { Table, Column, Model, DataType, CreatedAt } from 'sequelize-typescript';
import { Field, ObjectType, ID, Float } from '@nestjs/graphql';

@ObjectType() 
@Table({
    tableName: 'expenses',
    timestamps: true,
    underscored: false,
}) // Sequelize model
export default class Expense extends Model {
    @Field(() => ID)
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    // In expense.model.ts
    @Field({ nullable: true }) // Change this line to allow null
    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'Untitled Expense',
    })
    title: string;

    @Field(() => Float, { nullable: true }) // Allow null in GraphQL
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true,
    })
    amount: number | null;

    @Field({ nullable: true })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    category: string;

    @Field({ nullable: true })
    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description?: string;

    @Field()
    @CreatedAt
    declare createdAt: Date;
}