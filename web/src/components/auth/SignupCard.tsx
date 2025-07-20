import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Divider,
  Form,
} from "@heroui/react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupForm({
  onSubmit,
}: {
  onSubmit: SubmitHandler<SignupForm>;
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    mode: "onTouched",
  });
  const watchPassword = watch("password");

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col gap-1 pb-4">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <p className="text-default-500 text-small">
          Create your account to get started
        </p>
      </CardHeader>
      <Divider />
      <CardBody className="gap-4 pt-6">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            startContent={<Mail className="h-4 w-4 text-default-400" />}
            isRequired
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
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <EyeOff className="h-4 w-4 text-default-400" />
                ) : (
                  <Eye className="h-4 w-4 text-default-400" />
                )}
              </button>
            }
            type={isPasswordVisible ? "text" : "password"}
            isRequired
            {...register("password", {
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
          />
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            startContent={<Lock className="h-4 w-4 text-default-400" />}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => setIsConfirmVisible(!isConfirmVisible)}
              >
                {isConfirmVisible ? (
                  <EyeOff className="h-4 w-4 text-default-400" />
                ) : (
                  <Eye className="h-4 w-4 text-default-400" />
                )}
              </button>
            }
            type={isConfirmVisible ? "text" : "password"}
            isRequired
            {...register("confirmPassword", {
              validate: (value) =>
                value === watchPassword || "Passwords do not match",
            })}
            errorMessage={errors.confirmPassword?.message}
            isInvalid={!!errors.confirmPassword}
          />{" "}
          <div className="flex w-full justify-center">
            <Button color="primary" size="lg" className="mt-2" type="submit">
              Create Account
            </Button>
          </div>
        </Form>

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
  );
}
