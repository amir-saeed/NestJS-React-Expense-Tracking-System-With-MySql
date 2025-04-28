import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_EXPENSES, DELETE_EXPENSE } from '../graphql/operations';
import { ExpensesData } from '../types';

const ExpenseList: React.FC = () => {
  const { loading, error, data, refetch } = useQuery<ExpensesData>(GET_EXPENSES);
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  const [deleteExpense, { loading: deleteLoading }] = useMutation(DELETE_EXPENSE, {
    onCompleted: () => {
      setAlert({
        message: 'Expense deleted successfully',
        type: 'success',
      });
      refetch();

      setTimeout(() => {
        setAlert(null);
      }, 3000);
    },
    onError: (error) => {
      setAlert({
        message: `Error: ${error.message}`,
        type: 'danger',
      });
    },
  });

  const handleDeleteClick = (id: string) => {
    setSelectedExpenseId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedExpenseId) {
      deleteExpense({
        variables: { id: selectedExpenseId },
      });
    }
    setIsDeleteModalOpen(false);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) return <p>Loading expenses...</p>;
  if (error) return <p className="alert alert-danger">Error: {error.message}</p>;

  return (
    <main>
      <div className="expense-list">
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h1>Expense List</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/add')}
          >
            Add New Expense
          </button>
        </div>

        {data?.expenses.expenses.length === 0 ? (
          <p>No expenses found. Add your first expense using the button above.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.expenses.expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{formatDate(expense.createdAt)}</td>
                    <td>
                      <div style={{ fontWeight: 'bold' }}>{expense.title}</div>
                      {expense.description && (
                        <div style={{ color: '#718096', fontSize: '14px' }}>
                          {expense.description}
                        </div>
                      )}
                    </td>
                    <td>
                      {expense.category ? (
                        <span className="badge primary">{expense.category}</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {formatCurrency(expense.amount)}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-primary mr-2"
                        onClick={() => navigate(`/edit/${expense.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline btn-danger"
                        onClick={() => handleDeleteClick(expense.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-header">Delete Expense</div>
              <div className="modal-body">
                Are you sure you want to delete this expense? This action cannot be undone.
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline btn-primary"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ExpenseList;