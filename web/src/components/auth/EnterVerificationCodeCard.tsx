import { useSignup } from "@/hooks/stores/useSignup";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
  InputOtp,
} from "@heroui/react";
import { Key } from "lucide-react";

interface EnterVerificationCodeCardProps {
  onSubmit: () => void;
  onResend: () => void;
}

export default function EnterVerificationCodeCard({
  onSubmit,
  onResend,
}: EnterVerificationCodeCardProps) {
  const setVerificationCode = useSignup((state) => state.setVerificationCode);
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
            containerClassName="flex justify-center gap-2"
            onValueChange={(value) => {
              setVerificationCode(value);
            }}
          />
        </div>
      </CardBody>
      <CardFooter className="flex justify-between pt-4">
        <Button color="secondary" size="lg" onPress={onResend}>
          Resend Code
        </Button>
        <Button color="primary" size="lg" onPress={onSubmit}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
