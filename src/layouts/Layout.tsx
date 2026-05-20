import { Outlet } from "react-router-dom";
import Navbar from "../shared/components/layout/Navbar";
import Footer from "../shared/components/layout/Footer";
import ChatbotWidget from "../shared/components/ChatbotWidget";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white relative overflow-hidden">

      <Navbar />

      <main className="flex-1 relative z-10 pb-12">
        <Outlet />
      </main>
      <Footer/>
      <ChatbotWidget />
    </div>
  );
};

export default Layout;
