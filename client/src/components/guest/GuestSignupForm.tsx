import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const guestSignupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
});

type GuestSignupForm = z.infer<typeof guestSignupSchema>;

export default function GuestSignupForm() {
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
      const response = await apiRequest("/api/guest/signup", "POST", data);
      return response.json();
    },
    onSuccess: (data) => {
      setSubmitted(true);
      toast({
        title: "Guest Account Created",
        description: `Verification email sent to ${data.email}. Check your inbox to get started.`,
      });
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

  if (submitted) {
    return (
      <Card className="shadow-lg border border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-secondary text-2xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Check Your Email</h3>
            <p className="text-muted-foreground">
              We've sent a verification link to your email address. Click the link to activate your 30-day trial.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Start Your Free Trial
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
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
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Phone number (optional for enhanced features)"
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

        <p className="text-xs text-muted-foreground text-center mt-3">
          30-day trial • Upgrade anytime • No spam, ever
        </p>
      </CardContent>
    </Card>
  );
}
