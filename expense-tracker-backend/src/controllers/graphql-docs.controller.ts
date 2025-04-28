import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

class GraphQLQuery {
  query: string;
  variables?: Record<string, any>;
}

@ApiTags('GraphQL')
@Controller('graphql-docs')
export class GraphQLDocsController {
  @Post('/query')
  @ApiOperation({
    summary: 'Run GraphQL Query',
    description: 'graphql'
  })
  @ApiBody({
    description: 'GraphQL Query',
    type: GraphQLQuery,
    examples: {
      getAllExpenses: {
        summary: 'Get All Expenses',
        value: {
          query: `
            query GetExpenses {
              expenses {
                expenses {
                  id
                  title
                  amount
                  category
                  description
                  createdAt
                }
                total
              }
            }
          `,
          variables: {}
        }
      },
      getExpenseById: {
        summary: 'Get Expense by ID',
        value: {
          query: `
            query GetExpense($id: ID!) {
              expense(id: $id) {
                id
                title
                amount
                category
                description
                createdAt
              }
            }
          `,
          variables: {
            id: "123e4567-e89b-12d3-a456-426614174000"
          }
        }
      },
      createExpense: {
        summary: 'Create New Expense',
        value: {
          query: `
            mutation CreateExpense($createExpenseInput: CreateExpenseInput!) {
              createExpense(createExpenseInput: $createExpenseInput) {
                id
                title
                amount
                category
                description
                createdAt
              }
            }
          `,
          variables: {
            "createExpenseInput": {
              "title": "Grocery Shopping",
              "amount": 125.50,
              "category": "Food",
              "description": "Weekly grocery shopping"
            }
          }
        }
      },
      updateExpense: {
        summary: 'Update Existing Expense',
        value: {
          query: `
            mutation UpdateExpense($updateExpenseInput: UpdateExpenseInput!) {
              updateExpense(updateExpenseInput: $updateExpenseInput) {
                id
                title
                amount
                category
                description
                createdAt
              }
            }
          `,
          variables: {
            "updateExpenseInput": {
              "id": "123e4567-e89b-12d3-a456-426614174000",
              "title": "Updated Grocery Shopping",
              "amount": 150.75,
              "category": "Food",
              "description": "Weekly grocery shopping with additional items"
            }
          }
        }
      },
      deleteExpense: {
        summary: 'Delete Expense',
        value: {
          query: `
            mutation RemoveExpense($id: ID!) {
              removeExpense(id: $id)
            }
          `,
          variables: {
            "id": "123e4567-e89b-12d3-a456-426614174000"
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'This endpoint is for documentation only. Please use the actual GraphQL endpoint at /graphql',
  })
  graphqlDocs(@Body() query: GraphQLQuery) {
    return {
      message: 'This is a documentation endpoint only. Please use the actual GraphQL endpoint at /graphql',
      graphqlEndpoint: '/graphql',
      graphqlPlayground: '/graphql',
    };
  }
}