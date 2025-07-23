import { createFileRoute } from "@tanstack/react-router";
import LoginCard from "@/components/auth/login/LoginCard";
import { useLoginState } from "@/hooks/stores/useLoginState";
import LoggedInCard from "@/components/auth/login/LoggedInCard";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const isLoggedIn = useLoginState((state) => state.loggedEmail) || false;
  return (
    <div className="flex h-full w-full items-center justify-center">
      {isLoggedIn ? <LoggedInCard /> : <LoginCard />}
    </div>
  );
}
