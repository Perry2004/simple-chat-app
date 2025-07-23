import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";

import useLogout from "@/hooks/api/useLogout";
import { useLoginState } from "@/hooks/stores/useLoginState";
import { useTheme } from "@/hooks/stores/useTheme";
import { useState } from "react";

export default function LogoutButton() {
  const logoutMutation = useLogout();
  const loggedEmail = useLoginState((state) => state.loggedEmail);
  const resolvedTheme = useTheme((state) => state.resolvedTheme);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover
      placement="bottom"
      className={resolvedTheme}
      isOpen={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
    >
      <PopoverTrigger>
        <Button color="danger" variant="solid">
          Log Out
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0">
        <div className="flex flex-col">
          <div className="border-b border-divider px-4 py-3">
            <h3 className="text-base font-semibold text-foreground">
              Confirm Logout
            </h3>
          </div>

          <div className="px-4 py-4">
            <div className="mb-4 text-center">
              <p className="text-sm text-foreground-600">
                Are you sure you want to log out?
              </p>
              {loggedEmail && (
                <div className="mt-2 rounded-md bg-default-100 px-3 py-2">
                  <span className="text-xs text-foreground-500">
                    Logged in as:
                  </span>
                  <div className="text-sm font-medium text-foreground">
                    {loggedEmail}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                color="default"
                variant="bordered"
                size="sm"
                className="flex-1"
                onPress={() => setIsPopoverOpen(false)}
              >
                Cancel
              </Button>

              <Button
                color="danger"
                variant="solid"
                size="sm"
                className="flex-1"
                onPress={() => {
                  logoutMutation.mutate();
                }}
                isLoading={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Logging out..." : "Log Out"}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
