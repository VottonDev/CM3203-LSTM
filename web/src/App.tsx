import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import EmailVerification from './components/auth/EmailVerification';
import Logout from './components/auth/Logout';
import Dashboard from './pages/Dashboard';
import isAuthenticated from './common/AuthProvider';

function App() {
  const [authResponse, setAuthResponse] = useState<null | boolean>(null);

  useEffect(() => {
    async function fetchAuth() {
      const response = await isAuthenticated();
      setAuthResponse(response);
    }
    fetchAuth();
  }, []);

  if (authResponse === null) {
    return null; // or render a loading component
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/verify/*" element={<EmailVerification />} />
        <Route path="/auth/logout" element={<Logout />} />
        <Route path="/dashboard" element={authResponse === true ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
