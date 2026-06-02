import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { KeyRound, CheckCircle, XCircle, Loader2 } from "lucide-react";

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
  passwordHint: z.string().min(1, "Password hint is required").max(255),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetForm = z.infer<typeof resetSchema>;

type TokenStatus = "checking" | "valid" | "invalid";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("checking");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const token = new URLSearchParams(window.location.search).get("token") || "";

  useEffect(() => {
    if (!token) { setTokenStatus("invalid"); return; }
    fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.valid) { setEmail(d.email); setTokenStatus("valid"); }
        else setTokenStatus("invalid");
      })
      .catch(() => setTokenStatus("invalid"));
  }, [token]);

  const form = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "", passwordHint: "" },
  });

  const resetMutation = useMutation({
    mutationFn: async (data: ResetForm) => {
      const res = await apiRequest("/api/auth/reset-password", "POST", {
        token,
        password: data.password,
        passwordHint: data.passwordHint,
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      setDone(true);
      toast({ title: "Password Reset", description: data.message });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to reset password.", variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <KeyRound className="h-6 w-6 text-primary" />
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            {tokenStatus === "checking" && "Verifying your reset link…"}
            {tokenStatus === "valid" && email && `Setting a new password for ${email}`}
            {tokenStatus === "invalid" && "Invalid or expired reset link"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {tokenStatus === "checking" && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {tokenStatus === "invalid" && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  This reset link is invalid or has expired. Reset links are valid for 1 hour.
                  Please request a new one from the login page.
                </AlertDescription>
              </Alert>
              <Button className="w-full" onClick={() => setLocation("/")}>
                Back to Login
              </Button>
            </div>
          )}

          {tokenStatus === "valid" && done && (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your password has been reset successfully. You can now log in with your new password.
                </AlertDescription>
              </Alert>
              <Button className="w-full" onClick={() => setLocation("/")}>
                Go to Login
              </Button>
            </div>
          )}

          {tokenStatus === "valid" && !done && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit((d) => resetMutation.mutate(d))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
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
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passwordHint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Hint *</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="A hint to help you remember your password" {...field} />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        This hint will be shown if you forget your password again.
                      </p>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={resetMutation.isPending}>
                  {resetMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting Password…</>
                  ) : "Reset Password"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
