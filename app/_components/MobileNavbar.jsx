import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, SunIcon, MoonIcon, Computer } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Navbar } from "./Navbar";
import { useTheme } from "@/configs/ThemeContext";

const MobileNavbar = () => {
  const { theme, setTheme } = useTheme();

  // Handler to toggle body scroll and padding based on menu state
  const handleOpenChange = (open) => {
    if (open) {
      // Calculate scrollbar width
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-2">
          <MenuIcon size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {/* Mobile Navbar */}
        <div className="border-b border-gray-200 pb-2 mb-2">
          <Navbar isMobile />
        </div>
        {/* Mobile Theme Toggle */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <SunIcon width={16} />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
            <MoonIcon width={16} />
          </div>
          <button
            onClick={() => setTheme("system")}
            className={`p-1 rounded ${theme === "system" ? "bg-gray-300" : ""}`}
          >
            <Computer width={16} />
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileNavbar;
