import { Zap, LayoutDashboard, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar({ isOpen, setIsOpen }) {
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
          "fixed top-0 left-0 h-screen w-64 bg-card border-r p-6 z-50 transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:h-auto"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <Zap className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-bold">Energy Monitor</h1>
          </div>

          <button
            className="lg:hidden text-muted-foreground"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-10 space-y-1">
          <button className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
        </nav>
      </aside>
    </>
  );
}
