import { Navbar } from "@/components/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};
