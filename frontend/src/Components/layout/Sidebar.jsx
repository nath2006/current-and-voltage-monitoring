import {
  Zap,
  LayoutDashboard,
  X,
  ChartNoAxesCombined,
  House,
  Logs,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: House, label: "Dashboard" },
  { icon: ChartNoAxesCombined, label: "Tren Konsumsi" },
  { icon: LayoutDashboard, label: "Heatmap Pemakaian" },
  { icon: Logs, label: "Riwayat Pemakaian" },
];

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen w-70 flex-col bg-card border-r transition-all duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
          isCollapsed ? "lg:w-16" : "lg:w-64"
        )}
      >

        <div
          className={cn(
            "flex h-14 shrink-0 items-center justify-between border-b px-3",
            isCollapsed && "lg:justify-center"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2 overflow-hidden",
              isCollapsed && "lg:hidden"
            )}
          >
            <div className="shrink-0 rounded-md bg-primary p-1.5 text-primary-foreground">
              <Zap className="h-4 w-4" />
            </div>
            <h1 className="truncate text-sm font-semibold">Energy Monitor</h1>
          </div>

          <div className="group relative hidden shrink-0 lg:block">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:cursor-pointer"
            >
              <PanelLeft className="h-4 w-4" />
            </button>

            <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 scale-95 whitespace-nowrap rounded-md border bg-popover px-2 py-1 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 ">
              {isCollapsed ? "Buka sidebar" : "Tutup sidebar"}
            </span>
          </div>


          <button
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Bagian Nav Meny */}
        <nav className="flex-1 space-y-1.5 px-3 py-4">
          {menuItems.map(({ icon: Icon, label }) => (
            <div key={label} className="group relative">
              <button
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex w-full items-center rounded-xl text-[15px] font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground hover:cursor-pointer",
                  isCollapsed ? "lg:justify-center lg:px-0 lg:py-2.5" : "gap-3 px-3 py-3"
                )}
              >
                <Icon className="h-5 w-5 shrink-0 lg:h-4 lg:w-4" />
                <span className={cn(isCollapsed && "lg:hidden")}>{label}</span>
              </button>

              {isCollapsed && (
                <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 hidden -translate-y-1/2 scale-95 whitespace-nowrap rounded-md border bg-popover px-2 py-1 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 lg:block">
                  {label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
