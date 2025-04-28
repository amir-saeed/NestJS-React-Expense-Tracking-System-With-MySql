import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import Header from './components/layout/Header';
import { client } from './graphql/client';
import ExpenseList from './pages/ExpenseList';
import ExpenseForm from './pages/ExpenseForm';

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<ExpenseList />} />
            <Route path="/add" element={<ExpenseForm />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
