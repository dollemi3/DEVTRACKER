import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  ArrowLeft,
  User,
  Mail,
  MessageSquare,
  Code,
  Save,
  X,
  Plus
} from "lucide-react";
import { Button } from "../../components/ui/button";
import axios from "axios";



export const ProfilePage = (): JSX.Element => {

  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: user?.username || '',
    email: user?.email || '',
    statusMessage: user?.statusMessage || '',
    usingTech: user?.usingTech || [],
    profileImage: user?.profileImage || null
  });

  const [newTech, setNewTech] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTech = () => {
    if (newTech.trim() && !formData.usingTech.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        usingTech: [...prev.usingTech, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTech = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      usingTech: prev.usingTech.filter(tech => tech !== techToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const payload = {
        nickname: formData.nickname,
        statusMessage: formData.statusMessage,
        profileImage: user?.profileImage || null,
        usingTech: formData.usingTech,
      };

      const response = await axios.put(
        "http://localhost:3001/api/profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("프로필이 업데이트되었습니다!");
      setUser(response.data.user);
    } catch (err) {
      console.error("프로필 업데이트 실패:", err);
      alert("프로필 저장에 실패했습니다.");
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3001/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data.user;
        setFormData({
          nickname: data.nickname || "",
          email: data.email || "",
          statusMessage: data.statusMessage || "",
          usingTech: data.usingTech || [],
          profileImage: data.profileImage || null,
        });

        setUser(data);
      } catch (err) {
        console.error("오버레이용 프로필 정보 불러오기 실패:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  if (!user) {
    navigate('/login');
    return <div></div>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/image.png')" }}
    >
      {/* Background overlay */}
      <div className="min-h-screen bg-white bg-opacity-90">
        {/* Header */}
        <header className="bg-white bg-opacity-95 shadow-sm border-b backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Back button and Logo */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Link
                  to="/home"
                  className="text-2xl font-bold text-gray-900 [font-family:'Kaushan_Script',Helvetica]"
                >
                  DEVTRACKER
                </Link>
              </div>

              {/* User info */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user.username}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          {/* Profile Form */}
          <div className="bg-white bg-opacity-95 rounded-lg shadow-lg border backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Profile Image Section */}
              <div className="flex items-center space-x-6 pb-6 border-b">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-xs text-center">
                      profile<br />png
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Picture</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload a profile picture to personalize your account
                  </p>
                  <Button variant="outline" size="sm">
                    Change Picture
                  </Button>
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nickname
                    </label>
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="Enter your nickname"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              {/* Status Message */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Status Message
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Status
                  </label>
                  <textarea
                    name="statusMessage"
                    value={formData.statusMessage}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="What are you working on?"
                  />
                </div>
              </div>

              {/* Using Tech */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Using Tech
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technologies & Skills
                  </label>

                  {/* Current Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.usingTech.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add New Tech */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="Add a technology or skill"
                    />
                    <Button
                      type="button"
                      onClick={addTech}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Account Actions */}
          <div className="mt-8 bg-white bg-opacity-95 rounded-lg shadow-lg border backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start text-gray-700 hover:bg-gray-50"
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-gray-700 hover:bg-gray-50"
              >
                Download My Data
              </Button>
              <Button
                variant="outline"
                onClick={logout}
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};