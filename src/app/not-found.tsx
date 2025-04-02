"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Ghost } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
      <div className="flex flex-col items-center">
        <Ghost className="w-24 h-24 text-primary animate-bounce" />
        <h1 className="text-9xl font-extrabold text-primary">404</h1>
        <p className="text-xl mt-2 text-muted-foreground">
          Oops! Page not found.
        </p>
        <p className="text-lg text-muted-foreground mt-2">
          This page seems to have vanished{dots}
        </p>
      </div>
      <Button className="mt-6" onClick={() => router.push("/")}>
        Return Home
      </Button>
    </div>
  );
}
