import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  devtools,
  combine,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useEffect } from "react";

export type Theme = "light" | "dark" | "device";
export type ResolvedTheme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const resolveTheme = (theme: Theme): ResolvedTheme => {
  return theme === "device" ? getSystemTheme() : theme;
};

export const useTheme = create<ThemeState>()(
  devtools(
    persist(
      immer(
        combine(
          {
            theme: "device" as Theme,
            resolvedTheme: "light" as ResolvedTheme,
          },
          (set) => ({
            setTheme: (theme: Theme) => {
              set((state) => {
                state.theme = theme;
                state.resolvedTheme = resolveTheme(theme);
              });
            },
            toggleTheme: () => {
              set((state) => {
                const currentResolvedTheme = state.resolvedTheme;
                const newTheme =
                  currentResolvedTheme === "light" ? "dark" : "light";
                state.theme = newTheme;
                state.resolvedTheme = resolveTheme(newTheme);
              });
            },
          }),
        ),
      ),
      {
        name: "theme-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ theme: state.theme }),
        // Restore resolved theme after hydration
        onRehydrateStorage: () => (state) => {
          if (state && typeof window !== "undefined") {
            // Resolve the correct theme on the client side after hydration
            const resolvedTheme = resolveTheme(state.theme);

            // Defer to after hydration completion
            setTimeout(() => {
              useTheme.setState({ resolvedTheme });
            }, 0);

            const updateDeviceTheme = () => {
              if (useTheme.getState().theme === "device") {
                const newResolvedTheme = getSystemTheme();
                useTheme.setState({ resolvedTheme: newResolvedTheme });
              }
            };

            const mediaQuery = window.matchMedia(
              "(prefers-color-scheme: dark)",
            );
            mediaQuery.addEventListener("change", updateDeviceTheme);
          }
        },
      },
    ),
  ),
);

/**
 * Hook to ensure theme is properly initialized on client side
 */
export const useThemeInitialization = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Only run on client side after hydration
    if (typeof window !== "undefined") {
      setTheme(theme);
    }
  }, [theme, setTheme]);
};
