import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SignIn from './pages/SignIn';
import { AuthProvider } from './hooks/AuthContext';
import Routes from './routes';

const App: React.FC = () => (
  <>
    <AuthProvider>
      <Router>
        <Routes />
      </Router>
    </AuthProvider>
  </>
);

export default App;
