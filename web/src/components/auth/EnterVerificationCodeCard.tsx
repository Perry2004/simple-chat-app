import { useSignup } from "@/hooks/stores/useSignup";
import useSendVerification from "@/hooks/api/useSendVerification";
import useRegister from "@/hooks/api/useRegister";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
  InputOtp,
  Spinner,
  Alert,
} from "@heroui/react";
import { Key } from "lucide-react";

export default function EnterVerificationCodeCard() {
  const setVerificationCode = useSignup((state) => state.setVerificationCode);
  const verificationCode = useSignup((state) => state.verificationCode);
  const resendCooldownExpiry = useSignup((state) => state.resendCooldownExpiry);
  const sendVerificationMutation = useSendVerification();
  const registerMutation = useRegister();

  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    if (!resendCooldownExpiry) return;
    const updateCountdown = () => {
      const now = Date.now();
      const remaining = Math.max(
        0,
        Math.ceil((resendCooldownExpiry - now) / 1000),
      );
      setCountdown(remaining);

      if (remaining > 0) {
        setTimeout(updateCountdown, 1000);
      }
    };
    updateCountdown();
  }, [resendCooldownExpiry]);

  const isResendDisabled = countdown > 0 || sendVerificationMutation.isPending;
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="flex flex-col items-center gap-1 pb-4">
        <Key className="h-12 w-12 text-blue-500" aria-label="Key" />
        <h2 className="text-2xl font-bold">Enter Verification Code</h2>
        <p className="text-default-500 text-small">
          Please enter the verification code sent to your email address
        </p>
      </CardHeader>
      <Divider />
      <CardBody className="gap-4 pt-6">
        <div className="flex flex-col items-center gap-4">
          <InputOtp
            length={6}
            value={verificationCode || ""}
            containerClassName="flex justify-center gap-2"
            onValueChange={(value) => {
              setVerificationCode(value);
              if (registerMutation.isError) {
                registerMutation.reset();
              }
            }}
          />
          {registerMutation.isError && (
            <Alert
              color="danger"
              variant="flat"
              title="Invalid Code"
              description="Please check your email and try again."
            />
          )}
        </div>
      </CardBody>
      <CardFooter className="flex justify-between pt-4">
        <Button
          color="secondary"
          size="lg"
          onPress={() => {
            if (registerMutation.isError) {
              registerMutation.reset();
            }
            setVerificationCode("");
            sendVerificationMutation.mutate();
          }}
          isDisabled={isResendDisabled}
        >
          {sendVerificationMutation.isPending ? (
            <Spinner size="sm" color="default" />
          ) : countdown > 0 ? (
            `Resend in ${countdown}s`
          ) : (
            "Resend Code"
          )}
        </Button>
        <Button
          color="primary"
          size="lg"
          onPress={() => registerMutation.mutate()}
          isDisabled={verificationCode?.length !== 6}
        >
          {registerMutation.isPending ? (
            <Spinner color="default" />
          ) : (
            "Verify and Sign Up"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
