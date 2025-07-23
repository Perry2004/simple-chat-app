import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircleCode } from "lucide-react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full">
      <section className="relative flex h-full flex-col items-center justify-center px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <MessageCircleCode className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Simple Chat App
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Connect with friends and families in real-time. Experience
              seamless communication with our intuitive chat platform designed
              for simplicity and performance.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/auth/signup"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <Link
                to="/auth/login"
                className="text-sm font-semibold leading-6 text-gray-900 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
              >
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
