import { Navbar } from "../components";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col gap-10 h-screen">
      <Navbar />
      <main className="px-2 md:px-8 flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
