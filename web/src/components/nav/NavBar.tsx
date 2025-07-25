import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { MessageCircleCode } from "lucide-react";
import { useState } from "react";
import ThemeSelection from "./ThemeSelection";
import { useLoginState } from "@/hooks/stores/useLoginState";
import LogoutButton from "../auth/logout/LogoutButton";
import useAuthenticate from "@/hooks/api/useAuthenticate";

export default function NavBar() {
  // initiate authentication check to set the account state
  useAuthenticate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loggedEmail = useLoginState((state) => state.loggedEmail);
  const isLoggedIn = !!loggedEmail;

  const loggedInMenuItems = [
    "Chat",
    "Dashboard",
    "Profile",
    "My Settings",
    "Help & Feedback",
    "Log Out",
  ];

  const loggedOutMenuItems = [
    "Features",
    "About",
    "Contact",
    "Log In",
    "Sign Up",
  ];

  const menuItems = isLoggedIn ? loggedInMenuItems : loggedOutMenuItems;

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="text-inherit">
            <MessageCircleCode />
            <p className="font-bold text-inherit">simple-chat-app</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/current">
            Current
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Profile
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSelection />
        </NavbarItem>
        {isLoggedIn ? (
          <>
            <NavbarItem className="hidden sm:flex">
              <span className="text-sm text-default-500">
                Welcome, {loggedEmail}
              </span>
            </NavbarItem>
            <NavbarItem>
              <LogoutButton />
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Button
                as={Link}
                color="primary"
                href="/auth/login"
                variant="light"
              >
                Log In
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="/auth/signup"
                variant="flat"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
      <NavbarMenu>
        {isLoggedIn && (
          <NavbarMenuItem key="user-email">
            <div className="w-full border-b border-default-200 p-2 text-sm text-default-500">
              Welcome, {loggedEmail}
            </div>
          </NavbarMenuItem>
        )}
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                item === "Log Out"
                  ? "danger"
                  : item === "Chat" || item === "Sign Up"
                    ? "primary"
                    : "foreground"
              }
              href={
                item === "Chat"
                  ? "/app/current"
                  : item === "Log In"
                    ? "/auth/login"
                    : item === "Sign Up"
                      ? "/auth/signup"
                      : "#"
              }
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
