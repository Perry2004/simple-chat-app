import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
} from "@heroui/react";
import { Link } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";

export default function SignupSuccessCard() {
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-1 pb-4">
          <CheckCircle
            className="h-12 w-12 text-success"
            aria-label="Success"
          />
          <h2 className="text-2xl font-bold">Signup Successful!</h2>
          <p className="text-default-500 text-small">
            Welcome to our platform!
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="gap-4 pt-6">
          <p className="text-center text-default-500">
            Your account has been created successfully. Please check your email
            for verification instructions.
          </p>
        </CardBody>
        <CardFooter className="flex justify-center pt-4">
          <Button
            as={Link}
            to="/auth/login"
            color="primary"
            size="lg"
            className="w-full"
          >
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
