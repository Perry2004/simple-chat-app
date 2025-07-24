import NotFound404 from "@/pages/NotFound404";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/exceptions/404")({
  component: () => <NotFound404 />,
});
