import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Watch } from "lucide-react";

const guestSignupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
});

type GuestSignupForm = z.infer<typeof guestSignupSchema>;

interface GuestAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GuestAccessModal({ open, onOpenChange }: GuestAccessModalProps) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<GuestSignupForm>({
    resolver: zodResolver(guestSignupSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  const createGuestMutation = useMutation({
    mutationFn: async (data: GuestSignupForm) => {
      const response = await apiRequest("POST", "/api/guest/signup", data);
      return response.json();
    },
    onSuccess: (data) => {
      setSubmitted(true);
      toast({
        title: "Guest Account Created",
        description: `Verification email sent to ${data.email}. Check your inbox to get started.`,
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create guest account",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GuestSignupForm) => {
    createGuestMutation.mutate(data);
  };

  const handleClose = () => {
    setSubmitted(false);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Watch className="h-5 w-5 text-secondary" />
            <span>Guest Access</span>
          </DialogTitle>
        </DialogHeader>

        {!submitted ? (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Get instant access to all calculators and resources with just your email.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary text-xs">✓</span>
                </div>
                <span className="text-sm text-gray-700">Access all 32+ financial calculators</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary text-xs">✓</span>
                </div>
                <span className="text-sm text-gray-700">Save and export calculation results</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary text-xs">✓</span>
                </div>
                <span className="text-sm text-gray-700">Complete resource library access</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary text-xs">✓</span>
                </div>
                <span className="text-sm text-gray-700">Email verification only - no password required</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Phone number for enhanced features"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createGuestMutation.isPending}
                >
                  {createGuestMutation.isPending ? "Creating Account..." : "Get Instant Access"}
                </Button>
              </form>
            </Form>

            <p className="text-xs text-muted-foreground text-center">
              30-day trial • Upgrade anytime • No spam, ever
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-secondary text-2xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold">Check Your Email</h3>
            <p className="text-muted-foreground">
              We've sent a verification link to your email address. Click the link to activate your 30-day trial.
            </p>
            <Button onClick={handleClose}>Got it</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
