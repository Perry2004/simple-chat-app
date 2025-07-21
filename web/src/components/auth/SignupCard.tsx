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
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldX,
  ShieldEllipsis,
} from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import usePreregister from "@/hooks/api/usePreregister";
import { useSignup } from "@/hooks/stores/useSignup";
import { axiosInstance } from "@/utils/axiosInstance";
import * as z from "zod";

export interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupCard() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const preregisterMutation = usePreregister();
  const setRegistrationEmail = useSignup((state) => state.setRegistrationEmail);

  const debouncedEmailCheck = useCallback(
    async (email: string): Promise<string | boolean> => {
      return new Promise((resolve) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
          try {
            const res = await axiosInstance.get(`/auth/check-email`, {
              params: { email },
            });
            console.log("Email check result:", res.data);
            if (res.data) {
              resolve("Email already exists");
            } else {
              resolve(true);
            }
          } catch (error) {
            console.error("Email validation error:", error);
            resolve(true);
          }
        }, 1000);
      });
    },
    [],
  );

  const onSubmit: SubmitHandler<SignupForm> = (data) => {
    preregisterMutation.mutate({
      email: data.email,
      password: data.password,
    });
    setRegistrationEmail(data.email);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting, isValidating, dirtyFields },
  } = useForm<SignupForm>({
    mode: "onBlur",
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
            {...register("email", {
              required: "Please enter your email",
              validate: {
                checkEmailAlreadyExists: debouncedEmailCheck,
                checkEmailFormat: (value) => {
                  const emailSchema = z.string().email();
                  const result = emailSchema.safeParse(value);
                  if (result.error) {
                    return "Please enter a valid email address";
                  }
                  return true;
                },
              },
            })}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            endContent={
              <button className="focus:outline-none" type="button" disabled>
                {(() => {
                  if (isValidating) {
                    return (
                      <ShieldEllipsis className="h-4 w-4 text-yellow-500" />
                    );
                  }
                  if (errors.email) {
                    return <ShieldX className="h-4 w-4 text-red-500" />;
                  }
                  if (dirtyFields.email && !errors.email) {
                    return <ShieldCheck className="h-4 w-4 text-green-500" />;
                  }
                  return (
                    <ShieldEllipsis className="h-4 w-4 text-default-300" />
                  );
                })()}
              </button>
            }
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
            {...register("password", {
              required: "Please enter a password",
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
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watchPassword || "Passwords do not match",
            })}
            errorMessage={errors.confirmPassword?.message}
            isInvalid={!!errors.confirmPassword}
          />
          <div className="flex w-full flex-col items-center justify-center">
            {preregisterMutation.isError && (
              <Alert
                color="danger"
                variant="flat"
                title="Registration Failed"
                description={
                  "An error occurred during registration. Please try again."
                }
              />
            )}
            <Button
              color="primary"
              size="lg"
              className="mt-2"
              type="submit"
              isDisabled={!isValid}
            >
              {preregisterMutation.isPending || isSubmitting ? (
                <Spinner color="default" />
              ) : (
                "Create Account"
              )}
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
