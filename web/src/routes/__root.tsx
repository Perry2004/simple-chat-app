/// <reference types="vite/client" />
import type { ReactNode } from "react";
import {
  createRootRoute,
  HeadContent,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import NotFound404 from "@/components/status/NotFound404";
import "@/styles/index.css";
import { HeroUIProvider } from "@heroui/react";
import RootLayout from "@/layouts/RootLayout";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Simple Chat App",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => <NotFound404 />,
  context: () => ({
    queryClient,
  }),
});

function RootComponent() {
  const router = useRouter();

  return (
    <RootDocument>
      <HeroUIProvider
        navigate={(to, options) => router.navigate({ to, ...(options || {}) })}
        useHref={(to) => router.buildLocation({ to }).href}
      >
        <QueryClientProvider client={queryClient}>
          <RootLayout />
          <TanStackRouterDevtools />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </HeroUIProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
