import NavBar from "@/components/nav/NavBar";
import { useTheme, useThemeInitialization } from "@/hooks/stores/useTheme";
import { Outlet } from "@tanstack/react-router";

export default function RootLayout() {
  const resolvedTheme = useTheme((state) => state.resolvedTheme);
  // Initialize theme properly on client side to avoid hydration mismatch
  useThemeInitialization();

  return (
    <div
      className={resolvedTheme + " flex min-h-screen flex-col justify-between"}
    >
      <header className="bg-green-100">
        <NavBar />
      </header>
      <main className="flex flex-1 bg-pink-200">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
      <footer className="bg-blue-300">Global Footer</footer>
    </div>
  );
}
