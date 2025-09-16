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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Captcha } from "@/components/Captcha";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Watch, LogIn } from "lucide-react";

const guestSignupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
});

const guestLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type GuestSignupForm = z.infer<typeof guestSignupSchema>;
type GuestLoginForm = z.infer<typeof guestLoginSchema>;

interface GuestAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GuestAccessModal({ open, onOpenChange }: GuestAccessModalProps) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("signup");
  const [captcha, setCaptcha] = useState({ question: "", answer: "" });

  const signupForm = useForm<GuestSignupForm>({
    resolver: zodResolver(guestSignupSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  const loginForm = useForm<GuestLoginForm>({
    resolver: zodResolver(guestLoginSchema),
    defaultValues: {
      email: "",
    },
  });

  const createGuestMutation = useMutation({
    mutationFn: async (data: GuestSignupForm) => {
      return apiRequest("/api/guest/signup", "POST", data);
    },
    onSuccess: (data: any) => {
      setSubmitted(true);
      toast({
        title: "Guest Account Created",
        description: `Verification email sent to ${data.email}. Check your inbox to get started.`,
      });
      signupForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create guest account",
        variant: "destructive",
      });
    },
  });

  const guestLoginMutation = useMutation({
    mutationFn: async (data: GuestLoginForm) => {
      return apiRequest("/api/guest/login", "POST", {
        ...data,
        captcha,
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Login Successful",
        description: "Welcome back! Accessing your guest account.",
      });
      // Store guest session data
      localStorage.setItem("guestAccount", JSON.stringify(data));
      onOpenChange(false);
      loginForm.reset();
      setCaptcha({ question: "", answer: "" });
      // Reload page to update auth state
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Email not found or account not verified.",
        variant: "destructive",
      });
    },
  });

  const onSignupSubmit = (data: GuestSignupForm) => {
    createGuestMutation.mutate(data);
  };

  const onLoginSubmit = (data: GuestLoginForm) => {
    if (!captcha.question || !captcha.answer) {
      toast({
        title: "Captcha Required",
        description: "Please complete the security check.",
        variant: "destructive",
      });
      return;
    }
    guestLoginMutation.mutate(data);
  };

  const handleClose = () => {
    setSubmitted(false);
    setActiveTab("signup");
    signupForm.reset();
    loginForm.reset();
    setCaptcha({ question: "", answer: "" });
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup" data-testid="tab-guest-signup">
                Sign Up
              </TabsTrigger>
              <TabsTrigger value="login" data-testid="tab-guest-login">
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signup" className="space-y-6">
              <p className="text-muted-foreground">
                Get instant access to Vehicle Financing calculators with just your email.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-secondary text-xs">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">Access Vehicle Financing calculators</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-secondary text-xs">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">Save calculation results</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-secondary text-xs">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">30-day trial access</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-secondary text-xs">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">Email verification only</span>
                </div>
              </div>

              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            {...field}
                            data-testid="input-guest-signup-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Phone number for enhanced features"
                            {...field}
                            data-testid="input-guest-signup-phone"
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
                    data-testid="button-guest-signup"
                  >
                    {createGuestMutation.isPending ? "Creating Account..." : "Get Instant Access"}
                  </Button>
                </form>
              </Form>

              <p className="text-xs text-muted-foreground text-center">
                30-day trial • Upgrade anytime • No spam, ever
              </p>
            </TabsContent>

            <TabsContent value="login" className="space-y-6">
              <p className="text-muted-foreground">
                Sign in to your existing guest account to access Vehicle Financing calculators.
              </p>

              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            {...field}
                            data-testid="input-guest-login-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Captcha
                    value={captcha}
                    onChange={setCaptcha}
                    error={loginForm.formState.errors.root?.message}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={guestLoginMutation.isPending}
                    data-testid="button-guest-login"
                  >
                    {guestLoginMutation.isPending ? "Logging in..." : "Sign In"}
                  </Button>
                </form>
              </Form>

              <p className="text-xs text-muted-foreground text-center">
                Don't have an account? Switch to the Sign Up tab above.
              </p>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-secondary text-2xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold">Check Your Email</h3>
            <p className="text-muted-foreground">
              We've sent a verification link to your email address. Click the link to activate your 30-day trial.
            </p>
            <Button onClick={handleClose} data-testid="button-guest-signup-close">
              Got it
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
