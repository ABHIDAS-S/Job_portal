/* eslint-disable no-unused-vars */
import Header from "../components/Header";
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

const AppLayout = () => {
  const location = useLocation();
  let showGetInTouch = false;
 location.pathname==="/" ? showGetInTouch = true : showGetInTouch = false;

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container pt-5 pb-10  ">
        <Header />
        <Outlet />
        <Toaster />
      </main>
      <div className="  ">
        <Footer showGetInTouch={showGetInTouch} />
        {/* {" "}
        © 2024. All rights reserved by Midhun */}
      </div>
    </div>
  );
};

export default AppLayout;
