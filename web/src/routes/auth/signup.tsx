import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Divider,
} from "@heroui/react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 pb-4">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <p className="text-default-500 text-small">
            Create your account to get started
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="gap-4 pt-6">
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            startContent={<Mail className="h-4 w-4 text-default-400" />}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            startContent={<Lock className="h-4 w-4 text-default-400" />}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeOff className="h-4 w-4 text-default-400" />
                ) : (
                  <Eye className="h-4 w-4 text-default-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            startContent={<Lock className="h-4 w-4 text-default-400" />}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleConfirmVisibility}
              >
                {isConfirmVisible ? (
                  <EyeOff className="h-4 w-4 text-default-400" />
                ) : (
                  <Eye className="h-4 w-4 text-default-400" />
                )}
              </button>
            }
            type={isConfirmVisible ? "text" : "password"}
          />

          <Button color="primary" size="lg" className="mt-2">
            Create Account
          </Button>

          <div className="text-center">
            <p className="text-default-500 text-small">
              Already have an account?{" "}
              <a href="/auth/login" className="text-primary hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
