import { Outlet } from "react-router-dom";

const BaseLayout = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default BaseLayout;
