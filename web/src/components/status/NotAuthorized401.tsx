import { useLoginState } from "@/hooks/stores/useLoginState";
import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { useRouter } from "@tanstack/react-router";
import { ShieldX, LogIn, ArrowLeft } from "lucide-react";

export default function NotAuthorized401() {
  const router = useRouter();
  const setBeforeLoginPath = useLoginState((state) => state.setBeforeLoginPath);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  };

  const handleGoToLogin = () => {
    setBeforeLoginPath(location.pathname);
    router.navigate({ to: "/auth/login" });
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center text-center">
          <ShieldX className="mb-4 h-16 w-16 text-danger" />
          <h1 className="text-2xl font-bold text-foreground">Not Authorized</h1>
          <p className="text-sm text-foreground-500">
            You need to be logged in to access this page
          </p>
        </CardHeader>
        <CardBody className="flex flex-col items-center space-y-4">
          <p className="text-center text-sm text-foreground-600">
            Please log in with your account to continue accessing this content.
          </p>
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button
              color="primary"
              variant="solid"
              className="w-full"
              onPress={handleGoToLogin}
              startContent={<LogIn className="h-4 w-4" />}
            >
              Go to Login
            </Button>
            <Button
              variant="faded"
              className="w-full"
              onPress={handleGoBack}
              startContent={<ArrowLeft className="h-4 w-4" />}
            >
              Go Back
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
