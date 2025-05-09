
import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plus, LayoutDashboard, Image, ChartBar, Settings, Menu, X, FolderPlus } from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Dashboard navigation items
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true,
    },
    {
      name: "Create Drop",
      path: "/dashboard/create",
      icon: <Plus className="h-5 w-5" />,
    },
    {
      name: "Create Collection",
      path: "/dashboard/collection/create",
      icon: <FolderPlus className="h-5 w-5" />,
    },
    {
      name: "My Drops",
      path: "/dashboard/drops",
      icon: <Image className="h-5 w-5" />,
    },
    {
      name: "Stats",
      path: "/dashboard/stats",
      icon: <ChartBar className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden p-4 border-b">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className="flex items-center"
          >
            <Menu className="h-5 w-5 mr-2" />
            Menu
          </Button>
        </div>
        
        {/* Sidebar */}
        <aside
          className={`bg-sidebar-background border-r border-sidebar-border transition-all duration-300 ${
            sidebarOpen ? "w-full md:w-64" : "w-0 md:w-16 overflow-hidden"
          } ${sidebarOpen ? "block" : "hidden md:block"}`}
        >
          <div className="p-4 flex items-center justify-between">
            <h2 className={`font-bold text-xl ${!sidebarOpen && "md:hidden"}`}>
              Creator Dashboard
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="p-2">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      }`
                    }
                  >
                    {item.icon}
                    <span className={!sidebarOpen ? "md:hidden" : ""}>
                      {item.name}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
