import ThemeToggle from "@/components/theme-toggle";

export default function Header() {
  return (
    <header className="bg-card border-b px-6 py-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <ThemeToggle />
    </header>
  );
}
