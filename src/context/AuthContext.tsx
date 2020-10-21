import React, { createContext, useCallback } from 'react';
import api from '../services/api';

interface SignInCredentials {
  enrollment: string;
  password: string;
}

interface AuthContextData {
  name: string;
  signIn(data: SignInCredentials): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC = ({ children }) => {
  const signIn = useCallback(async ({ enrollment, password }) => {
    const response = await api.post('sessions', {
      enrollment,
      password,
    });
    console.log(response.data);
  }, []);

  return (
    <AuthContext.Provider value={{ name: 'Diego', signIn }}>
      {children}
    </AuthContext.Provider>
  );
};
