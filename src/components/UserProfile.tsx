import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import axios from 'axios';

export const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<{
    username: string;
    email: string;
    statusMessage: string;
    usingTech: string[];
    profileImage: string | null;
  } | null>(null);

  // 프로필 불러오기
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(res.data.user);
    } catch (err) {
      console.error("프로필 불러오기 실패:", err);
    }
  };

  // mount 시 fetch
  useEffect(() => {
    fetchProfile();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user || !profile) return null;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleSettings = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-gray-600" />
          )}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden md:block">
          {profile.username}
        </span>
      </button>

      {/* Profile Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border z-50 p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-xs text-center">
                    profile<br />png
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {profile.username}
                </h3>
                <div className="border border-gray-300 rounded p-2 mb-3">
                  <p className="text-sm text-gray-600">
                    {profile.statusMessage || "상태메시지를 작성해주세요."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">using tech</h4>
              <div className="flex flex-wrap gap-2">
                {profile.usingTech?.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSettings}
                className="flex-1 flex items-center justify-center space-x-1"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
