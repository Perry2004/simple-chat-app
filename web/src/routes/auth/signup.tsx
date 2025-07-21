import { createFileRoute } from "@tanstack/react-router";
import SignupCard from "@/components/auth/signup/SignupCard";
import ConfirmVerificationCard from "@/components/auth/signup/ConfirmSendVerificationCard";
import EnterVerificationCodeCard from "@/components/auth/signup/EnterVerificationCodeCard";
import SignupSuccessCard from "@/components/auth/signup/SignupSuccessCard";
import { useSignup } from "@/hooks/stores/useSignup";
import { useShallow } from "zustand/shallow";

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
  onLeave: () => {
    useSignup.getState().reset();
    console.log("Reset signup state on leave");
  },
});

function RouteComponent() {
  const { step: signupStep } = useSignup(
    useShallow((state) => ({ step: state.step })),
  );

  return (
    <div className="flex h-full items-center justify-center">
      {(() => {
        switch (signupStep) {
          case "initial":
            return <SignupCard />;
          case "entered-credentials":
            return <ConfirmVerificationCard />;
          case "verification-sent":
            return <EnterVerificationCodeCard />;
          case "verified":
            return <SignupSuccessCard />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
