import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export const Sidebar = () => {
  return (
    <div className="flex">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 dark:bg-[#141414] bg-[#f0f0f0] p-5 sticky top-0 h-screen">
        <div className="mt-20 space-y-5">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 ${
                isActive
                  ? "text-blue-700 dark:text-blue-500 font-semibold"
                  : "text-gray-800 dark:text-gray-200"
              }`
            }
          >
            <ChartNoAxesColumn size={22} />
            <h1>Dashboard</h1>
          </NavLink>
          <NavLink
            to="course"
            className={({ isActive }) =>
              `flex items-center gap-2 ${
                isActive
                  ? "text-blue-700 dark:text-blue-500 font-semibold"
                  : "text-gray-800 dark:text-gray-200"
              }`
            }
          >
            <SquareLibrary size={22} />
            <h1>Courses</h1>
          </NavLink>
        </div>
      </div>
      <div className="flex-1 md:p-24 p-5 md:mt-2 mt-20">
        <Outlet />
      </div>
    </div>
  );
};
