import { createFileRoute } from "@tanstack/react-router";
import SignupCard, { SignupForm } from "@/components/auth/SignupCard";
import usePreregister from "@/hooks/api/usePreregister";
import { SubmitHandler } from "react-hook-form";
import ConfirmVerificationCard from "@/components/auth/ConfirmSendVerification";
import { useSignup } from "@/hooks/stores/useSignup";
import { useShallow } from "zustand/shallow";
import useSendVerification from "@/hooks/api/useSendVerification";
import EnterVerificationCodeCard from "@/components/auth/EnterVerificationCodeCard";
import useRegister from "@/hooks/api/useRegister";
import SignupSuccessCard from "@/components/auth/SignupSuccessCard";

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const preregisterMutation = usePreregister();
  const sendVerificationMutation = useSendVerification();
  const registerMutation = useRegister();
  const { step: signupStep, setRegistrationEmail } = useSignup(
    useShallow((state) => ({
      step: state.step,
      setRegistrationEmail: state.setRegistrationEmail,
    })),
  );

  const onPreregister: SubmitHandler<SignupForm> = (data) => {
    preregisterMutation.mutate({
      email: data.email,
      password: data.password,
    });
    setRegistrationEmail(data.email);
  };

  const onSendEmailAccept = () => {
    sendVerificationMutation.mutate();
  };

  const onVerificationCodeSubmit = () => {
    registerMutation.mutate();
  };

  return (
    <div className="flex h-full items-center justify-center">
      {(() => {
        switch (signupStep) {
          case "initial":
            return <SignupCard onSubmit={onPreregister} />;
          case "entered-credentials":
            return <ConfirmVerificationCard onAccept={onSendEmailAccept} />;
          case "verification-sent":
            return (
              <EnterVerificationCodeCard
                onResend={() => {}}
                onSubmit={onVerificationCodeSubmit}
              />
            );
          case "verified":
            return <SignupSuccessCard />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
