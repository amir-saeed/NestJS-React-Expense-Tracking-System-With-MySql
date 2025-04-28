// src/graphql/operations.ts
import { gql } from '@apollo/client';

export const GET_EXPENSES = gql`
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
`;

export const GET_EXPENSE = gql`
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
`;

export const CREATE_EXPENSE = gql`
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
`;

export const UPDATE_EXPENSE = gql`
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
`;

export const DELETE_EXPENSE = gql`
  mutation RemoveExpense($id: ID!) {
    removeExpense(id: $id)
  }
`;