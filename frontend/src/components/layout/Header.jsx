import { Menu } from "lucide-react";

const Header = ({ onMenuClick }) => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 hover:bg-muted md:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-lg font-semibold">ResQ</h1>
      </div>

      {/* You can add profile/avatar or notifications here later */}
      <div className="text-sm text-muted-foreground">Restaurant Dashboard</div>
    </header>
  );
};

export default Header;
