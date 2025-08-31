import React from "react";
import { NavBar } from "../components/NavBar";
import { SideBar } from "../components/SideBar";

export const SistemLayout = ({ children }) => {
  return (
    <>

      {" "}
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
