import { useTheme } from "@/stores/useTheme";
import { Button, Card, CardBody } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/")({
  component: RouteComponent,
});

function RouteComponent() {
  const toggleTheme = useTheme((state) => state.toggleTheme);
  
  return (
    <>
      <div className="text-3xl">Hello "/(app)/"!</div>
      <Card>
        <CardBody>
          <p>Make beautiful websites regardless of your design experience.</p>
        </CardBody>
      </Card>
      <Button onClick={() => {
        toggleTheme();
      }}>
        Toggle theme
      </Button>
    </>
  );
}
