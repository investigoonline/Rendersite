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
import { KeyRound, Mail, Lightbulb, AlertCircle } from "lucide-react";

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
  const [passwordHint, setPasswordHint] = useState<string | null>(null);
  const [hintRequested, setHintRequested] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const getHintMutation = useMutation({
    mutationFn: async (data: ForgotPasswordForm) => {
      return apiRequest("/api/auth/password-hint", "POST", data);
    },
    onSuccess: (data: any) => {
      setHintRequested(true);
      if (data.hint) {
        setPasswordHint(data.hint);
      } else {
        setPasswordHint(null);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Unable to retrieve password hint.",
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordForm) => {
      return apiRequest("/api/auth/forgot-password", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Coming Soon",
        description: "Password reset via email is not yet available. Please contact support for assistance.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process request.",
        variant: "destructive",
      });
    },
  });

  const onGetHint = (data: ForgotPasswordForm) => {
    getHintMutation.mutate(data);
  };

  const onResetPassword = (data: ForgotPasswordForm) => {
    resetPasswordMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    setPasswordHint(null);
    setHintRequested(false);
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
            Enter your email to get your password hint or request a password reset.
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

              {hintRequested && (
                <Alert className={passwordHint ? "border-primary bg-primary/5" : "border-muted"}>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Password Hint</AlertTitle>
                  <AlertDescription>
                    {passwordHint 
                      ? passwordHint 
                      : "No password hint was set for this account."}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={form.handleSubmit(onGetHint)}
                  disabled={getHintMutation.isPending}
                  data-testid="button-get-hint"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {getHintMutation.isPending ? "Getting Hint..." : "Get Password Hint"}
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
                  onClick={form.handleSubmit(onResetPassword)}
                  disabled={resetPasswordMutation.isPending}
                  data-testid="button-reset-password"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {resetPasswordMutation.isPending ? "Processing..." : "Reset Password via Email"}
                </Button>
              </div>
            </form>
          </Form>

          <Alert variant="default" className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Email Reset Coming Soon</AlertTitle>
            <AlertDescription className="text-amber-700">
              Password reset via email is not yet available. Please use your password hint or contact our support team for assistance.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
}
