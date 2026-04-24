import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";



const Layout = () => {
  return (
    <div className="min-h-screen flex flex-row bg-brand-white relative overflow-hidden">
      
      <AdminNavbar />
      
      <main className="flex-1 relative z-10 pb-12">
        <Outlet />
      </main>
      {/* <Footer/> */}
    </div>
  );
};

export default Layout;
