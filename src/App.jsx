import React from 'react';
import {TodoDashboard} from './TodoDashboard';
import './App.css';
import { DocumentGrid } from './Component/DocumentGrid';
import {Navbar} from './Component/Navbar';
import {useAuth, AuthProvider} from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import { AuthForm } from './Component/AuthForm';
import { DocumentProvider } from './context/DocumentContext';

function AppRoot() {
  const { user, loading } = useAuth();
    if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader-spinner"></div>
      </div>
    );
  }

    if(!user) {
        return <main className="auth-wrapper"><AuthForm /></main>;
    }

    return (
        <DocumentProvider>
            <TodoProvider>
                <div className="app-shell">
                    <Navbar />
                    <div className='main-content-layout'>
                        {/* <DocumentGrid/> */}
                        <TodoDashboard />   
                    </div>
                </div>   
            </TodoProvider> 
        </DocumentProvider>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <AppRoot />
        </AuthProvider>
    );
}