import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MainPage } from "./screens/MainPage";
import { ProjectPage } from "./screens/ProjectPage";
import { CommunityPage } from "./screens/CommunityPage";
import { ResourcesPage } from "./screens/ResourcesPage";
import { LoginPage } from "./screens/LoginPage";
import { RegisterPage } from "./screens/RegisterPage";
import { ProfilePage } from "./screens/ProfilePage";

export const App = (): JSX.Element => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/home" element={<MainPage />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};