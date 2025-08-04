import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  username: string;
  statusMessage: string;
  usingTech: string[];
  profileImage?: string | null;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ 로그인 함수: 서버에 요청해서 토큰과 사용자 정보 받기
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password
      });

      const { token } = res.data;
      localStorage.setItem('token', token); // 저장

      await fetchUser(); // 로그인 후 사용자 정보 가져오기
    } catch (err) {
      console.error('로그인 실패:', err);
      throw err;
    }
  };

  // ✅ 사용자 정보 불러오기
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get('http://localhost:3001/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data.user);
    } catch (err) {
      console.error('사용자 정보 불러오기 실패:', err);
      setUser(null);
    }
  };

  // ✅ 로그아웃
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // ✅ 앱 시작 시 토큰이 있으면 자동 로그인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    }
  }, []);

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
