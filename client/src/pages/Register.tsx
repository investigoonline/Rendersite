import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Captcha } from "@/components/Captcha";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertUserRegistrationSchema } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

// Create a form schema that includes confirm password
const registrationFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationForm = z.infer<typeof registrationFormSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isGuestUser, guestAccount } = useAuth();
  const [captcha, setCaptcha] = useState({ question: "", answer: "" });

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationForm) => {
      const { confirmPassword, ...registrationData } = data;
      return apiRequest("POST", "/api/auth/register", {
        ...registrationData,
        captcha,
      });
    },
    onSuccess: () => {
      // Check if this was a guest account upgrade
      const wasGuestUpgrade = isGuestUser && guestAccount;
      
      if (wasGuestUpgrade) {
        // Clear guest account from localStorage since it's been deleted on backend
        localStorage.removeItem("guestAccount");
        
        // Clear React Query cache to force auth state refresh
        queryClient.removeQueries({ queryKey: ["/api/auth/user"] });
        
        toast({
          title: "Account Upgraded Successfully!",
          description: "You've successfully upgraded from guest access to a full account. Please check your email to verify your account before logging in.",
        });
      } else {
        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account before logging in.",
        });
      }
      
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegistrationForm) => {
    if (!captcha.question || !captcha.answer) {
      toast({
        title: "Captcha Required",
        description: "Please complete the security check.",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Register for full access to all financial calculators and tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          {...field}
                          data-testid="input-firstname"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Smith"
                          {...field}
                          data-testid="input-lastname"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        data-testid="input-email"
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
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        {...field}
                        data-testid="input-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        data-testid="input-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        data-testid="input-confirm-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Captcha
                value={captcha}
                onChange={setCaptcha}
                error={form.formState.errors.root?.message}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
                data-testid="button-register"
              >
                {registerMutation.isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/">
              <Button variant="link" className="p-0" data-testid="link-login">
                Sign in
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}