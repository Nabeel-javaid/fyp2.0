import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/react";

const Layout = ({ children }) => {
  return (
    <div>
      <NavBar />
      {children}
      <SpeedInsights />
      <Footer />
    </div>
  );
};

export default React.memo(Layout);
