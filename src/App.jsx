import React from 'react';
import TodoDashboard from './TodoDashboard';
import {useAuth, AuthProvider} from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import { AuthForm } from './Component/AuthForm';

function AppRoot() {
  const { user, loading } = useAuth();
    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loaming tada...</div>;
    }

    if(!user) {
        return <AuthForm />;
    }

    return (
        <TodoProvider>
            <TodoDashboard />
        </TodoProvider>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <AppRoot />
        </AuthProvider>
    );
}