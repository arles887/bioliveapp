
"use client";

import { Sprout } from "lucide-react";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 2 : 100));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 scale-150 animate-pulse-gentle rounded-full bg-primary/20 blur-xl"></div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-2xl">
            <Sprout size={48} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">BioLive</h1>
          <p className="text-sm font-medium text-muted-foreground">Cultivating Connection</p>
        </div>
      </div>
      <div className="absolute bottom-16 w-full max-w-[200px] px-4">
        <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
          <div 
            className="h-full bg-primary transition-all duration-100 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
