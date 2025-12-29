import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, Loader2 } from "lucide-react";
import type { PageContent } from "@shared/schema";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.enum([
    "general_inquiry",
    "technical_support",
    "account_support",
    "billing_question",
    "feature_request",
    "consultation_request",
    "partnership_inquiry",
    "other",
  ]),
  message: z.string().min(10, "Message must be at least 10 characters"),
  preferredContact: z.enum(["email", "phone", "either"]).default("email"),
});

type ContactForm = z.infer<typeof contactSchema>;

const subjectOptions = [
  { value: "general_inquiry", label: "General Inquiry" },
  { value: "technical_support", label: "Technical Support" },
  { value: "account_support", label: "Account Support" },
  { value: "billing_question", label: "Billing Question" },
  { value: "feature_request", label: "Feature Request" },
  { value: "consultation_request", label: "Consultation Request" },
  { value: "partnership_inquiry", label: "Partnership Inquiry" },
  { value: "other", label: "Other" },
];

const contactMethodOptions = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "either", label: "Either Email or Phone" },
];

export default function ContactForm() {
  const { toast } = useToast();

  // Fetch form fields content from CMS
  const { data: formFieldsContent } = useQuery<PageContent[]>({
    queryKey: ["/api/content", "contact"],
    queryFn: async () => {
      const res = await fetch("/api/content?page=contact", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch content");
      return res.json();
    },
  });

  const formFields =
    (formFieldsContent?.find((c) => c.section === "contact_form_fields")
      ?.content as any) || {};

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "general_inquiry",
      message: "",
      preferredContact: "email",
    },
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      const response = await apiRequest("/api/contact", "POST", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: formFields.successTitle || "Message Sent Successfully",
        description:
          formFields.successMessage ||
          "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error Sending Message",
        description:
          error.message || "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    submitContactMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{formFields.nameLabel || "Full Name *"}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      formFields.namePlaceholder || "Enter your full name"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {formFields.emailLabel || "Email Address *"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={
                      formFields.emailPlaceholder || "Enter your email address"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {formFields.phoneLabel || "Phone Number (Optional)"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={
                      formFields.phonePlaceholder || "Enter your phone number"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {formFields.contactMethodLabel || "Preferred Contact Method"}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contactMethodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{formFields.subjectLabel || "Subject *"}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {formFields.messageLabel || "Your Message *"}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    formFields.messagePlaceholder ||
                    "Tell us how we can help you..."
                  }
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-gray-50 p-4 rounded-lg text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Response Time:</strong> We typically respond within 24 hours
            during business days.
          </p>
          <p>
            <strong>Privacy:</strong> Your information is secure and will never
            be shared with third parties.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={submitContactMutation.isPending}
        >
          {submitContactMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Message...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {formFields.submitButtonText || "Send Message"}
            </>
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Need immediate assistance? Call us at{" "}
          <a
            href="tel:+1 (512) 923-6479"
            className="text-primary hover:underline"
          >
            +1 (512) 923-6479
          </a>
        </div>
      </form>
    </Form>
  );
}
