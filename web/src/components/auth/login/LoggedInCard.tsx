import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import { CheckCircle, Home } from "lucide-react";

export default function LoggedInCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col items-center gap-2 pb-4">
        <CheckCircle className="h-12 w-12 text-success" />
        <h2 className="text-center text-2xl font-bold">
          Successfully Logged In!
        </h2>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-default-600">
            Welcome back! You have been successfully logged in to your account.
          </p>
          <Button
            as={Link}
            to="/"
            color="primary"
            size="lg"
            startContent={<Home className="h-5 w-5" />}
            className="w-full"
          >
            Go to Home Page
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
