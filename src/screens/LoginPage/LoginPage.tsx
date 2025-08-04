import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import axios from "axios";

export const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    usingTech: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", res.data.token);
      await login(formData.email, formData.password);
      navigate("/home");
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "로그인에 실패했습니다.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
      style={{ backgroundImage: "url('/image.png')" }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-20" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            to="/home"
            className="text-4xl font-bold text-gray-900 [font-family:'Kaushan_Script',Helvetica]"
          >
            DEVTRACKER
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Devtracker</h2>
            <p className="text-gray-600">오신 것을 환영합니다.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />

            <Button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              로그인
            </Button>
          </form>

          <div className="mt-6">
            <div className="text-center text-sm text-gray-500 mb-4">
              아직 계정이 없으신가요? {" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                회원가입
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-5 h-5 bg-red-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Google로 로그인</span>
              </button>

              <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-5 h-5 bg-gray-800 rounded-full mr-3"></div>
                <span className="text-gray-700">GitHub로 로그인</span>
              </button>

              <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-5 h-5 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Naver로 로그인</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
