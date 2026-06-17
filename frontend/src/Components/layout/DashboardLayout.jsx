import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Button } from "@/Components/ui/button";

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <main className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
          <Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <Header />

        <div className="p-5">{children}</div>
      </main>
    </div>
  );
}
