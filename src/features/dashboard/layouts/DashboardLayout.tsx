import { Outlet } from "react-router-dom";


const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white relative overflow-hidden">
      
      {/* <Navbar /> */}
      
      <main className="flex-1 relative z-10 pb-12">
        <Outlet />
      </main>
      {/* <Footer/> */}
    </div>
  );
};

export default Layout;
