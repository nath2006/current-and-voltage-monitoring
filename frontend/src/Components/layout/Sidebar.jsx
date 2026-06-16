export default function Sidebar({
  isOpen,
  setIsOpen,
}) {
  return (
    <>
      {/* Overlay Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64
          bg-slate-900 text-white p-6 z-50
          transform transition-transform duration-300

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
          lg:static
          lg:h-auto
        `}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Energy Monitor
          </h1>

          <button
            className="lg:hidden text-xl"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="mt-10 space-y-3">
          <button className="w-full text-left p-3 rounded-lg bg-slate-800">
            Dashboard
          </button>
        </nav>
      </aside>
    </>
  );
}
