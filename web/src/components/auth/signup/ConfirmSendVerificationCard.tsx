import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
  Spinner,
  Alert,
} from "@heroui/react";
import useSendVerification from "@/hooks/api/useSendVerification";
import { Mail } from "lucide-react";
import { useSignup } from "@/hooks/stores/useSignup";

export default function ConfirmVerificationCard() {
  const sendVerificationMutation = useSendVerification();
  const registrationEmail = useSignup((state) => state.registrationEmail);
  const prevStep = useSignup((state) => state.prevStep);
  const reset = useSignup((state) => state.reset);
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="flex flex-col items-center gap-1 pb-4">
        <Mail className="h-12 w-12 text-blue-500" aria-label="Mail" />
        <h2 className="text-2xl font-bold">Email Verification</h2>
        <p className="text-default-500 text-small">
          Please verify your email address
        </p>
      </CardHeader>
      <Divider />
      <CardBody className="gap-4 pt-6">
        <p className="text-center text-default-500 text-small">
          Do you accept to be sent an email to{" "}
          <span className="font-bold">{registrationEmail}</span> to verify your
          account?
        </p>
      </CardBody>
      <CardFooter className="flex flex-col justify-center gap-4 pt-4">
        {sendVerificationMutation.isError && (
          <Alert
            color="danger"
            variant="flat"
            title="Verification Failed"
            description={
              "An error occurred while sending the verification email. Please try again."
            }
          />
        )}
        <div className="flex flex-row items-center justify-center gap-4">
          <Button
            color="secondary"
            size="lg"
            onPress={() => {
              prevStep();
              reset();
            }}
          >
            Back
          </Button>
          <Button
            color="primary"
            size="lg"
            onPress={() => sendVerificationMutation.mutate()}
          >
            {sendVerificationMutation.isPending ? (
              <Spinner color="default" />
            ) : (
              "Yes, send email"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
