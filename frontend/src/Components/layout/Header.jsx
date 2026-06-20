 import ThemeToggle from "@/components/theme-toggle";

// export default function Header() {
//   return (
//     <header className="bg-card border-b px-6 py-4 flex items-center justify-between">
//       <h2 className="text-xl font-semibold">Dashboard</h2>
//       <ThemeToggle />
//     </header>
//   );
// }
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30  flex h-14 items-center gap-3 border-b bg-card px-4 sm:px-5">
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden shrink-0"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className="text-base sm:text-lg font-semibold truncate">Dashboard</h1>

     <div className="ml-auto">
      <ThemeToggle />
     </div>
    </header>
  );
}
