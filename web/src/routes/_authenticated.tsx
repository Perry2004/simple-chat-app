import useAuthenticate from "@/hooks/api/useAuthenticate";
import { useLoginState } from "@/hooks/stores/useLoginState";
import NotAuthorized401 from "@/pages/NotAuthorized401";
import { Spinner } from "@heroui/react";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: async () => {
    const loggedEmail = useLoginState.getState().loggedEmail;
    if (!loggedEmail) {
      useLoginState.getState().setBeforeLoginPath(location.pathname);
      throw redirect({
        to: "/exceptions/401",
      });
    }
  },
});

function RouteComponent() {
  // trigger an update on the query state on every access to the _authenticated route
  const { isLoading, isError } = useAuthenticate();
  const loggedEmail = useLoginState((state) => state.loggedEmail);
  if (isLoading || (!loggedEmail && !isError)) {
    return <Spinner />;
  } else if (!loggedEmail) {
    return <NotAuthorized401 />;
  } else {
    return <Outlet />;
  }
}
