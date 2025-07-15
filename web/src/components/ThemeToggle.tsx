import { useTheme } from "@/stores/useTheme";
import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const resolvedTheme = useTheme((state) => state.resolvedTheme);
  const toggleTheme = useTheme((state) => state.toggleTheme);
  return (
    <Button
      onPress={() => {
        toggleTheme();
      }}
    >
      {resolvedTheme === "light" ? <Sun /> : <Moon />}
    </Button>
  );
}
