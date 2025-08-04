import { Star, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";

interface Project {
  id: number;
  name: string;
  description: string;
  starred: boolean;
}

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  // ✅ 프로젝트 불러오기
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3001/api/project", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(res.data.projects);
      } catch (err) {
        console.error("프로젝트 목록 불러오기 실패:", err);
      }
    };

    fetchProjects();
  }, []);

  // ✅ 프로젝트 추가
  const addProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3001/api/project",
        { name: `New Project ${Date.now()}` },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProjects((prev) => [res.data.project, ...prev]);
    } catch (err) {
      console.error("프로젝트 추가 실패:", err);
    }
  };

  const handleProjectClick = (project: Project) => {
    navigate(`/project/${project.id}`);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gray-600 bg-opacity-90 backdrop-blur-sm z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-500">
          <h2 className="text-white text-lg font-medium">Project List</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700 hover:bg-opacity-50 cursor-pointer transition-colors group"
              >
                <Star
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${project.starred
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-400"
                    }`}
                />

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm group-hover:text-gray-100">
                    {project.name}
                  </h3>
                  <p className="text-gray-300 text-xs mt-1 group-hover:text-gray-200">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 text-gray-400 hover:text-white hover:bg-gray-600"
                  >
                    <span className="text-xs">⚙</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 text-gray-400 hover:text-white hover:bg-gray-600"
                  >
                    <span className="text-xs">A</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-500">
            <Button
              variant="ghost"
              className="w-full text-gray-300 hover:text-white hover:bg-gray-700 justify-center"
              onClick={addProject}
            >
              + add
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
