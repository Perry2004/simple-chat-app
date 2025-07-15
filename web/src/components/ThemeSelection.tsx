import { useTheme, Theme } from "@/stores/useTheme";
import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Sun, Moon, MonitorCog } from "lucide-react";

export function ThemeSelection() {
  const setTheme = useTheme((state) => state.setTheme);
  const theme = useTheme((state) => state.theme);
  const resolvedTheme = useTheme((state) => state.resolvedTheme);

  const themeOptions = [
    {
      key: "light",
      text: "Light",
      icon: <Sun />,
    },
    {
      key: "dark",
      text: "Dark",
      icon: <Moon />,
    },
    {
      key: "device",
      text: "Device",
      icon: <MonitorCog />,
    },
  ];
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button>
          {themeOptions.find((option) => option.key === resolvedTheme)?.icon}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme Menu"
        onAction={(value) => {
          setTheme(value as Theme);
        }}
        selectedKeys={new Set([theme])}
        selectionMode="single"
        disallowEmptySelection
      >
        {themeOptions.map((option) => (
          <DropdownItem key={option.key} startContent={option.icon}>
            {option.text}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
