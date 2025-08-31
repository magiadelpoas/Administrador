import React from "react";
import { NavBar } from "../components/NavBar";
import { SideBar } from "../components/SideBar";
import { SidebarInitializer } from "../components/SidebarInitializer";

export const SistemLayout = ({ children }) => {
  return (
    <>
      <SidebarInitializer />
      <NavBar />  
      <SideBar />
      <main className="pc-container">
            <div className="pc-content">
               {children}
            </div>
         </main>
    </>
  );
};
