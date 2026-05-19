import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePageTitle } from "@/hooks/usePageTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Captcha } from "@/components/Captcha";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User } from "lucide-react";
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  usePageTitle("Client Portal Login");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [captcha, setCaptcha] = useState<{ question: string; answer: string }>({ question: "", answer: "" });
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) =>
      apiRequest("/api/auth/login", "POST", { ...data, captcha }),
    onSuccess: async () => {
      toast({ title: "Login Successful", description: "Welcome back to your account!" });
      form.reset();
      setCaptcha({ question: "", answer: "" });
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      await queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });
      setTimeout(() => { window.location.href = "/"; }, 100);
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "The email or password you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    if (!captcha.question || !captcha.answer) {
      toast({
        title: "Security Check Required",
        description: "Please complete the security verification to continue.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-primary/10 rounded-full p-3">
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Client Portal Login</CardTitle>
            <CardDescription>Sign in to access your financial planning dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" data-testid="input-email" {...field} />
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
                        <Input type="password" placeholder="••••••••" data-testid="input-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Captcha value={captcha} onChange={setCaptcha} />

                <Button type="submit" className="w-full" disabled={loginMutation.isPending} data-testid="button-login-submit">
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm mt-6 space-y-2">
              <div>
                <Button variant="link" className="p-0 text-primary" onClick={() => setForgotPasswordOpen(true)} data-testid="link-forgot-password">
                  Forgot Password?
                </Button>
              </div>
              <div>
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link href="/register">
                  <Button variant="link" className="p-0" data-testid="link-register">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ForgotPasswordModal open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen} />
    </div>
  );
}
