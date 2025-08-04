import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import axios from "axios";

export const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!formData.agreeTerms || !formData.agreePrivacy) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/auth/register", {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });

      // 회원가입 성공
      alert("회원가입이 완료되었습니다.");
      localStorage.setItem("token", response.data.token); // 토큰 저장 (선택)
      navigate("/login");
    } catch (error: any) {
      console.error("회원가입 에러:", error.response?.data || error.message);
      alert(error.response?.data?.message || "회원가입 중 문제가 발생했습니다.");
    }
  };


  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
      style={{ backgroundImage: "url('/image.png')" }}
    >
      {/* Background image */}
      <div className="absolute inset-0 bg-white bg-opacity-20" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/home"
            className="text-4xl font-bold text-gray-900 [font-family:'Kaushan_Script',Helvetica]"
          >
            DEVTRACKER
          </Link>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">계정 만들기</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="이메일을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <input
              type="text"
              name="username"
              placeholder="닉네임을 입력하세요"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="your-input-style"
            />

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="비밀번호를 다시 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              회원가입
            </Button>
          </form>

          <div className="mt-6">
            <div className="text-center text-sm text-gray-500 mb-4">
              이미 계정이 있으신가요?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                로그인
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
                <span className="text-gray-700">Google로 회원가입</span>
              </button>

              <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-5 h-5 bg-gray-800 rounded-full mr-3"></div>
                <span className="text-gray-700">GitHub로 회원가입</span>
              </button>

              <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-5 h-5 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Naver로 회원가입</span>
              </button>
            </div>

            {/* Terms and Conditions */}
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  required
                />
                <label className="ml-2 text-gray-700">
                  <span className="text-red-500">*</span> 이용약관에 동의합니다
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="agreePrivacy"
                  checked={formData.agreePrivacy}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  required
                />
                <label className="ml-2 text-gray-700">
                  <span className="text-red-500">*</span> 개인정보 처리방침에 동의합니다
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeMarketing"
                  checked={formData.agreeMarketing}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-gray-700">
                  마케팅 정보 수신에 동의합니다 (선택)
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};