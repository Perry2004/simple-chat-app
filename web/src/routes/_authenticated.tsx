import useAuthenticate from "@/hooks/api/useAuthenticate";
import { useLoginState } from "@/hooks/stores/useLoginState";
import NotAuthorized401 from "@/pages/NotAuthorized401";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: async () => {
    console.log("Before load for _authenticated route");
    const loggedEmail = useLoginState.getState().loggedEmail;
    console.log("Logged email:", loggedEmail);
    if (!loggedEmail) {
      console.warn("User is not authenticated, redirecting to login.");
      return { redirect: "/login" };
    } else {
      console.log("User is authenticated:", loggedEmail);
      return { continue: true };
    }
  },
});

function RouteComponent() {
  // trigger an update on the query state on every access to the _authenticated route
  useAuthenticate();
  const loggedEmail = useLoginState((state) => state.loggedEmail);
  if (!loggedEmail) {
    return <NotAuthorized401 />;
  } else {
    return <Outlet />;
  }
}
