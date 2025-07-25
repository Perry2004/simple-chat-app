import { authenticateQueryOptions } from "@/hooks/api/useAuthenticate";
import { useLoginState } from "@/hooks/stores/useLoginState";
import NotAuthorized401 from "@/components/status/NotAuthorized401";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import Loading from "@/components/status/Loading";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    const loggedEmail = useLoginState.getState().loggedEmail;
    if (!loggedEmail) {
      console.log("Not logged in, ignoreing authentication check.");
      return;
    } else {
      await queryClient.ensureQueryData(authenticateQueryOptions);
    }
  },
  pendingComponent: () => (
    <div className="flex h-full w-full items-center justify-center">
      <Loading message="Authenticating..." size="lg" />
    </div>
  ),
});

function RouteComponent() {
  const loggedEmail = useLoginState((state) => state.loggedEmail);
  if (!loggedEmail) {
    return <NotAuthorized401 />;
  } else {
    return <Outlet />;
  }
}
