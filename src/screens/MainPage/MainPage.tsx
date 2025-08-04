import { MenuIcon } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { UserProfile } from "../../components/UserProfile";
import { ProjectSidebar } from "../../components/ProjectSidebar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../components/ui/navigation-menu";

export const MainPage = (): JSX.Element => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Navigation menu items data
  const navItems = [
    { label: "Solutions", path: "#", onClick: toggleSidebar },
    { label: "Community", path: "/community" },
    { label: "Resources", path: "/resources" },
  ];

  return (
    <div className="bg-transparent flex flex-row justify-center w-full relative">
      <div className="w-full max-w-[1920px] h-[1081px]">
        <div className="flex flex-col w-full h-[1080px] items-start gap-2.5 relative bg-[#00000047] overflow-hidden shadow-[0px_4px_4px_#00000040]">
          {/* Background image */}
          <div
            className="relative self-stretch w-full h-[1080px] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/image-1.png')" }}
          />

          {/* Logo */}
          <Link
            to="/home"
            className="absolute w-full max-w-[1920/3] h-[93px] top-[41px] left-[30px] [font-family:'Kaushan_Script',Helvetica] font-normal text-black text-5xl tracking-[0] leading-[72px] hover:text-gray-700 transition-colors cursor-pointer"
          >
            DEVTRACKER
          </Link>

          {/* Main headline */}
          <div className="absolute w-[774px] h-[225px] top-[422px] left-[250px] [font-family:'Kay_Pho_Du',Helvetica] font-medium text-[#3a3a3a] text-5xl tracking-[0] leading-[72px]">
            MAKE PROJECT, <br />
            AND MANAGE PROCESSING
          </div>

          {/* Authentication buttons */}
          <div className="absolute top-[65px] right-[60px]">
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="bg-[#e3e3e3] border-[#767676] text-[#1e1e1e] rounded-lg"
                  >
                    Sign in
                  </Button>
                </Link>

                <Link to="/register">
                  <Button className="bg-[#2c2c2c] text-neutral-100 rounded-lg">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Navigation menu */}
          <NavigationMenu className="absolute top-[81px] left-[530px]">
            <NavigationMenuList className="flex flex-wrap items-start justify-end gap-[6px_6px]">
              {navItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink asChild>
                    {item.onClick ? (
                      <button
                        onClick={item.onClick}
                        className="font-single-line-body-base font-[number:var(--single-line-body-base-font-weight)] text-[#353535] text-[length:var(--single-line-body-base-font-size)] tracking-[var(--single-line-body-base-letter-spacing)] leading-[var(--single-line-body-base-line-height)] whitespace-nowrap [font-style:var(--single-line-body-base-font-style)]"
                        style={{ padding: 0, margin: 0, background: "none", border: "none", lineHeight: "inherit" }}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        className="font-single-line-body-base font-[number:var(--single-line-body-base-font-weight)] text-[#353535] text-[length:var(--single-line-body-base-font-size)] tracking-[var(--single-line-body-base-letter-spacing)] leading-[var(--single-line-body-base-line-height)] whitespace-nowrap [font-style:var(--single-line-body-base-font-style)]"
                      >
                        {item.label}
                      </Link>
                    )}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>



          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute w-12 h-12 top-[65px] right-[10px] p-0 hover:bg-gray-200 hover:bg-opacity-20"
            onClick={toggleSidebar}
          >
            <MenuIcon className="w-6 h-6 text-gray-700" />
          </Button>
        </div>
      </div>

      {/* Project Sidebar */}
      <ProjectSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </div>
  );
};
