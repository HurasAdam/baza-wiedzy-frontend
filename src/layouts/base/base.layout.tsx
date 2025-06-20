import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { Sidebar } from "./components/Sidebar";

const BaseLayout = () => {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <div className="flex flex-1 flex-col h-full">
        <Header />

        <main className="flex-1 overflow-y-auto h-full w-full bg-background">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;
