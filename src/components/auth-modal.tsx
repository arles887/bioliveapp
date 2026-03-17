
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout } from "lucide-react";

export function AuthModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-[2rem]">
        <DialogHeader className="flex flex-col items-center pb-4">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground mb-4">
            <Sprout size={28} />
          </div>
          <DialogTitle className="text-2xl font-headline font-bold">Welcome to BioLive</DialogTitle>
          <DialogDescription>Join our global community of bio-enthusiasts.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50 rounded-full h-11 p-1">
            <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-background">Login</TabsTrigger>
            <TabsTrigger value="register" className="rounded-full data-[state=active]:bg-background">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="hello@biolive.com" className="rounded-full h-11 focus-visible:ring-primary" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" className="rounded-full h-11 focus-visible:ring-primary" required />
              </div>
              <Button type="submit" className="w-full rounded-full h-11 bg-primary hover:bg-primary/90 mt-2" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Alex Gardener" className="rounded-full h-11 focus-visible:ring-primary" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input id="reg-email" type="email" placeholder="alex@biolive.com" className="rounded-full h-11 focus-visible:ring-primary" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input id="reg-password" type="password" className="rounded-full h-11 focus-visible:ring-primary" required />
              </div>
              <Button type="submit" className="w-full rounded-full h-11 bg-primary hover:bg-primary/90 mt-2" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-3 pt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="rounded-full">Google</Button>
            <Button variant="outline" className="rounded-full">Apple</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
