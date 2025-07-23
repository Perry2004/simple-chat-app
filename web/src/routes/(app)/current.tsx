import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/current")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(app)/current"!</div>;
}
