import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />
      </div>

      {/* Mobile Sidebar Drawer */}

      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          isMobileOpen ? "visible bg-black/50" : "invisible bg-black/0"
        }`}
        onClick={() => setIsMobileOpen(false)}
      >
        <div
          className={`h-full w-64 transform transition-transform duration-300 ease-in-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar
            collapsed={false}
            mobileOpen={true}
            onClose={() => setIsMobileOpen(false)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${
          isCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Header onMenuClick={() => setIsMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6">{children}</main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
