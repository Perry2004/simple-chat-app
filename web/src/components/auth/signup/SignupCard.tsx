import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Divider,
  Form,
  Alert,
  Spinner,
} from "@heroui/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldEllipsis,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import usePreregister from "@/hooks/api/usePreregister";
import { useImmer } from "use-immer";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSignup } from "@/hooks/stores/useSignup";

export default function SignupCard() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [formData, setFormData] = useImmer({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formValidState, setFormValidState] = useImmer({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastEmailRef = useRef("");
  const [emailCheckTarget, setEmailCheckTarget] = useState("");
  const [emailValidating, setEmailValidating] = useState(false);

  const preregisterMutation = usePreregister();
  const setRegistrationEmail = useSignup((state) => state.setRegistrationEmail);

  useEffect(() => {
    const email = formData.email.trim();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (email === lastEmailRef.current) {
      return;
    }

    lastEmailRef.current = email;

    const dummyEmailInput = document.createElement("input");
    dummyEmailInput.type = "email";
    dummyEmailInput.value = email;
    if (!dummyEmailInput.checkValidity()) {
      return;
    }
    setEmailValidating(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        console.log("Validating email:", email);
        setEmailCheckTarget(email);
        setEmailValidating(false);
      } catch (error) {
        console.error("Email validation error:", error);
      }
    }, 1000);
  }, [formData.email]);

  const {
    data,
    isLoading,
    error: checkEmailError,
  } = useQuery({
    queryKey: ["checkEmail", emailCheckTarget],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/check-email", {
        params: { email: emailCheckTarget },
      });
      setFormValidState((draft) => {
        draft.email = !response.data;
      });
      return response.data;
    },
    enabled: emailCheckTarget !== "",
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col gap-1 pb-4">
        <h1 className="text-2xl font-bold">Sign Up </h1>
        <p className="text-default-500 text-small">
          Create your account to get started
          {"Email validating: " + emailValidating}
        </p>
      </CardHeader>
      <Divider />
      <CardBody className="gap-4 pt-6">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            preregisterMutation.mutate({
              email: formData.email,
              password: formData.password,
            });
            setRegistrationEmail(formData.email);
          }}
        >
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            startContent={<Mail className="h-4 w-4 text-default-400" />}
            onValueChange={(value) => {
              setFormData((draft) => {
                draft.email = value;
              });
              setFormValidState((draft) => {
                draft.email = false;
              });
            }}
            endContent={
              <button className="focus:outline-none" type="button" disabled>
                {(() => {
                  if (formData.email.trim() === "") {
                    return (
                      <ShieldEllipsis className="h-4 w-4 text-default-400" />
                    );
                  } else if (isLoading || emailValidating) {
                    return (
                      <ShieldEllipsis className="h-4 w-4 text-yellow-500" />
                    );
                  } else if (!formValidState.email) {
                    return <ShieldX className="h-4 w-4 text-red-500" />;
                  } else if (data === false) {
                    return <ShieldCheck className="h-4 w-4 text-green-500" />;
                  } else {
                    return <ShieldX className="h-4 w-4 text-red-500" />;
                  }
                })()}
              </button>
            }
            validate={() => {
              if (data === true) {
                return "Email already registered";
              }
            }}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            startContent={<Lock className="h-4 w-4 text-default-400" />}
            minLength={6}
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
            onValueChange={(value) => {
              setFormData((draft) => {
                draft.password = value;
              });
              setFormValidState((draft) => {
                draft.password = value.length >= 6;
              });
            }}
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
            onValueChange={(value) => {
              setFormData((draft) => {
                draft.confirmPassword = value;
              });
              setFormValidState((draft) => {
                draft.confirmPassword =
                  value === formData.password && value !== "";
              });
            }}
            isInvalid={
              !formValidState.confirmPassword && formData.confirmPassword !== ""
            }
            errorMessage="Passwords do not match"
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
            {checkEmailError && (
              <Alert
                color="danger"
                variant="flat"
                title="Email Check Failed"
                description="There was an error checking the email. Please try again."
              />
            )}
            <Button
              color="primary"
              size="lg"
              className="mt-2"
              type="submit"
              isDisabled={
                !formValidState.email ||
                !formValidState.password ||
                !formValidState.confirmPassword
              }
            >
              {preregisterMutation.isPending ? (
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
