import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Divider,
  Form,
  Spinner,
  Alert,
} from "@heroui/react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useLogin from "@/hooks/api/useLogin";

export interface LoginForm {
  email: string;
  password: string;
}

export default function LoginCard() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const loginMutation = useLogin();

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    console.log("Login data:", data);
    loginMutation.mutate(data);
  };
  const { register, handleSubmit } = useForm<LoginForm>();

  return (
    <div className="flex h-full w-4/12 items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 pb-4">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-default-500 text-small">
            Welcome back! Please sign in to your account
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="gap-4 pt-6">
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center"
          >
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              startContent={<Mail className="h-4 w-4 text-default-400" />}
              {...register("email")}
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
                  tabIndex={-1}
                >
                  {isVisible ? (
                    <EyeOff className="h-4 w-4 text-default-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-default-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              {...register("password")}
            />
            {loginMutation.isError && (
              <Alert
                color="danger"
                variant="flat"
                description="Invalid credentials. Please try again."
              />
            )}

            <Button
              color="primary"
              size="lg"
              className="mt-2"
              type="submit"
              as="button"
              isDisabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <Spinner color="default" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Form>

          <div className="text-center">
            <p className="text-default-500 text-small">
              Don't have an account?{" "}
              <a href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
