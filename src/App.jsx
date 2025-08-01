import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Lista from './components/Lista';
import Login from './components/Login';
import ToastContainer from './components/Toast';

function AppContent() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Login />;
  }

  return <Lista />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
