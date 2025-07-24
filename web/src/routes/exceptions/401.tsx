import NotAuthorized401 from "@/pages/NotAuthorized401";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/exceptions/401")({
  component: () => <NotAuthorized401 />,
});
