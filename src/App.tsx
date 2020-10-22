import React from 'react';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './hooks/AuthContext';

const App: React.FC = () => (
  <>
    <AuthProvider>
      <SignIn />
    </AuthProvider>
  </>
);

export default App;
