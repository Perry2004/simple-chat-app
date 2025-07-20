import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
} from "@heroui/react";
import { Mail } from "lucide-react";

interface ConfirmVerificationCardProps {
  onAccept: () => void;
}

export default function ConfirmVerificationCard({
  onAccept,
}: ConfirmVerificationCardProps) {
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
          Do you accept to be sent an email with a verification code?
        </p>
      </CardBody>
      <CardFooter className="flex justify-center pt-4">
        <Button color="primary" size="lg" onClick={onAccept}>
          Yes, send email
        </Button>
      </CardFooter>
    </Card>
  );
}
