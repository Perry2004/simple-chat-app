import { useLoginState } from "@/hooks/stores/useLoginState";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/current")({
  component: RouteComponent,
});

function RouteComponent() {
  const loggedEmail = useLoginState((state) => state.loggedEmail);
  return (
    <div>
      <div>Hello "/_authenticated/current"!</div>
      <div>Authenticated email: {loggedEmail}</div>
    </div>
  );
}
