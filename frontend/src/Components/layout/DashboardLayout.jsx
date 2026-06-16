import { useState } from "react";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}) {
  const [isOpen, setIsOpen] =
    useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <main className="flex-1">
        {/* Navbar Mobile */}
        <div className="lg:hidden p-4 border-b bg-white">
          <button
            onClick={() => setIsOpen(true)}
            className="text-2xl"
          >
            ☰
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>
      </main>
    </div>
  );
}
