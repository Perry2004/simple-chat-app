import Loading from "@/components/status/Loading";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/loading")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loading message="Authenticating..." size="lg" />
    </div>
  );
}
