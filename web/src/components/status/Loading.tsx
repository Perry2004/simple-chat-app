import { Card, CardBody, Spinner } from "@heroui/react";
import { Loader2 } from "lucide-react";

interface LoadingCardProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal";
  className?: string;
}

export default function LoadingCard({
  message = "Loading...",
  size = "md",
  variant = "default",
  className = "",
}: LoadingCardProps) {
  const sizeClasses = {
    sm: "w-64 h-32",
    md: "w-80 h-40",
    lg: "w-96 h-48",
  };

  if (variant === "minimal") {
    return (
      <div
        className={`flex items-center justify-center gap-3 p-4 ${className}`}
      >
        <Spinner size="md" color="primary" />
        <span className="text-default-500">{message}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Card className={`${sizeClasses[size]} ${className}`}>
        <CardBody className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm text-default-500">{message}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
