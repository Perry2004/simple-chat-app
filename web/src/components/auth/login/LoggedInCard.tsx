import { useLoginState } from "@/hooks/stores/useLoginState";
import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { useRouter } from "@tanstack/react-router";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function LoggedInCard() {
  const router = useRouter();
  const beforeLoginPath = useLoginState((state) => state.beforeLoginPath);

  const handleGoBack = () => {
    if (beforeLoginPath) {
      router.navigate({ to: beforeLoginPath || "/" });
    } else {
      router.navigate({ to: "/" });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="flex flex-col items-center gap-3 pb-6">
        <div className="rounded-full bg-success/10 p-3">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-center text-2xl font-bold text-foreground">
          Successfully Logged In!
        </h2>
        <p className="text-center text-sm text-default-500">
          Welcome! You're all set to continue.
        </p>
      </CardHeader>
      <CardBody className="pb-6 pt-0">
        <div className="flex flex-col items-center gap-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-default-200 to-transparent" />
          <Button
            onClick={handleGoBack}
            color="primary"
            size="md"
            startContent={<ArrowLeft className="h-4 w-4" />}
            className="px-8 font-medium"
          >
            Continue
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
