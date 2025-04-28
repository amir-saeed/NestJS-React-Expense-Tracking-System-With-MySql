import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_EXPENSE, UPDATE_EXPENSE, GET_EXPENSE, GET_EXPENSES } from '../graphql/operations';
import { categories, ExpenseData, ExpenseFormData } from '../types';

const ExpenseForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<ExpenseFormData>({
        title: '',
        amount: '',
        category: '',
        description: '',
    });

    const [errors, setErrors] = useState<Partial<ExpenseFormData>>({});
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

    const { loading: fetchLoading } = useQuery<ExpenseData>(GET_EXPENSE, {
        variables: { id },
        skip: !isEditMode,
        onCompleted: (data) => {
            setFormData({
                title: data.expense.title,
                amount: data.expense.amount.toString(),
                category: data.expense.category || '',
                description: data.expense.description || '',
            });
        },
        onError: (error) => {
            setAlert({
                message: `Error fetching expense: ${error.message}`,
                type: 'danger',
            });
        },
    });

    const [createExpense, { loading: createLoading }] = useMutation(CREATE_EXPENSE, {
        onCompleted: () => {
            setAlert({
                message: 'Expense created successfully',
                type: 'success',
            });

            setTimeout(() => {
                navigate('/');
            }, 1500);
        },
        onError: (error) => {
            setAlert({
                message: `Error creating expense: ${error.message}`,
                type: 'danger',
            });
        },
        refetchQueries: [{ query: GET_EXPENSES }],
    });

    const [updateExpense, { loading: updateLoading }] = useMutation(UPDATE_EXPENSE, {
        onCompleted: () => {
            setAlert({
                message: 'Expense updated successfully',
                type: 'success',
            });

            setTimeout(() => {
                navigate('/');
            }, 1500);
        },
        onError: (error) => {
            setAlert({
                message: `Error updating expense: ${error.message}`,
                type: 'danger',
            });
        },
        refetchQueries: [{ query: GET_EXPENSES }],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name as keyof ExpenseFormData]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ExpenseFormData> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.amount) {
            newErrors.amount = 'Amount is required';
        } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be a positive number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const expenseData = {
            title: formData.title.trim(),
            amount: parseFloat(formData.amount),
            category: formData.category || null,
            description: formData.description.trim() || null,
        };

        if (isEditMode && id) {
            updateExpense({
                variables: {
                    updateExpenseInput: {
                        id,
                        ...expenseData,
                    },
                },
            });
        } else {
            createExpense({
                variables: {
                    createExpenseInput: expenseData,
                },
            });
        }
    };

    const isLoading = fetchLoading || createLoading || updateLoading;

    return (
        <div className="expense-form">
            {alert && (
                <div className={`alert alert-${alert.type}`}>
                    {alert.message}
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h1>{isEditMode ? 'Edit Expense' : 'Add New Expense'}</h1>
                <button
                    className="btn btn-outline btn-primary"
                    onClick={() => navigate('/')}
                >
                    Back to List
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter expense title"
                        disabled={isLoading}
                    />
                    {errors.title && <div className="error-message">{errors.title}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        disabled={isLoading}
                    />
                    {errors.amount && <div className="error-message">{errors.amount}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        className="form-control"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={isLoading}
                    >
                        <option value="">Select category (optional)</option>
                        {categories.map((category: any) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter optional description"
                        rows={3}
                        disabled={isLoading}
                    />
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? isEditMode
                                ? 'Updating...'
                                : 'Creating...'
                            : isEditMode
                                ? 'Update Expense'
                                : 'Create Expense'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExpenseForm;