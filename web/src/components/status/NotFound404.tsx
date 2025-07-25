import { Button } from "@heroui/react";
import { Link, useRouter } from "@tanstack/react-router";
import { Home, ArrowLeft, MessageCircleCode } from "lucide-react";

export default function NotFound404() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  };

  return (
    <div className="h-full">
      <section className="relative flex h-full flex-col items-center justify-center px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <MessageCircleCode className="h-16 w-16 text-gray-400 dark:text-gray-500" />
          </div>

          <h1 className="text-9xl font-bold text-gray-500 dark:text-gray-700 sm:text-[12rem]">
            404
          </h1>

          <h2 className="-mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Page Not Found
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Sorry, we couldn't find the page you're looking for. The page might
            have been moved, deleted, or you entered the wrong URL.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Button
              as={Link}
              to="/"
              color="primary"
              size="lg"
              startContent={<Home className="h-4 w-4" />}
              className="min-w-[160px]"
            >
              Go Home
            </Button>

            <Button
              variant="faded"
              size="lg"
              onPress={handleGoBack}
              startContent={<ArrowLeft className="h-4 w-4" />}
              className="min-w-[160px]"
            >
              Go Back
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
