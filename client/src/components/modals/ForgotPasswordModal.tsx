import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { KeyRound, Mail, Lightbulb, CheckCircle } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ForgotPasswordModal({ open, onOpenChange }: ForgotPasswordModalProps) {
  const { toast } = useToast();
  const [hintSent, setHintSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const getHintMutation = useMutation({
    mutationFn: async (data: ForgotPasswordForm) =>
      apiRequest("/api/auth/password-hint", "POST", data),
    onSuccess: () => {
      setHintSent(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Unable to send password hint.",
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordForm) =>
      apiRequest("/api/auth/forgot-password", "POST", data),
    onSuccess: () => {
      setResetSent(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    form.reset();
    setHintSent(false);
    setResetSent(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <span>Forgot Password</span>
          </DialogTitle>
          <DialogDescription>
            Enter your email to receive your password hint or a reset link.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                        data-testid="input-forgot-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {hintSent && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Email Sent</AlertTitle>
                  <AlertDescription className="text-green-700">
                    If an account exists for that email, we've sent your password hint and a reset link. Please check your inbox.
                  </AlertDescription>
                </Alert>
              )}

              {resetSent && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Reset Link Sent</AlertTitle>
                  <AlertDescription className="text-green-700">
                    If an account exists for that email, a password reset link has been sent. It expires in 1 hour.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={form.handleSubmit((d) => getHintMutation.mutate(d))}
                  disabled={getHintMutation.isPending || hintSent}
                  data-testid="button-get-hint"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {getHintMutation.isPending ? "Sending…" : "Get Password Hint via Email"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full"
                  onClick={form.handleSubmit((d) => resetPasswordMutation.mutate(d))}
                  disabled={resetPasswordMutation.isPending || resetSent}
                  data-testid="button-reset-password"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {resetPasswordMutation.isPending ? "Sending…" : "Reset Password via Email"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
