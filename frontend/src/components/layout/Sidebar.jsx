import { NavLink } from "react-router";
import {
  LayoutDashboard,
  CalendarDays,
  Armchair,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Settings,
  Users,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    path: "/bookings",
    icon: CalendarDays,
  },
  {
    title: "Tables",
    path: "/tables",
    icon: Armchair,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
  {
    title: "Customers",
    path: "/customers",
    icon: Users,
  },
];

const Sidebar = ({ collapsed, onToggleCollapse, mobileOpen, onClose }) => {
  return (
    <aside
      className={`flex h-full fixed inset-0 flex-col border-r bg-card transition-all duration-200
        ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <span className="text-xl font-bold text-primary">BookMe</span>
        )}

        <button
          onClick={mobileOpen ? onClose : onToggleCollapse}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted"
          aria-label={mobileOpen ? "Close sidebar" : "Toggle sidebar width"}
        >
          {mobileOpen ? (
            <X size={20} />
          ) : collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-3">
        {navItems.map(({ title, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/dashboard"}
            onClick={onClose}
            title={collapsed ? title : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
              transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span>{title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t p-4">
        {!collapsed && (
          <p className="text-xs text-muted-foreground">Powered by ResQ</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
