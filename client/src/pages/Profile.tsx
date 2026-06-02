import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  User, Camera, Mail, Phone, Calendar, Shield,
  Loader2, Save, X, Check, KeyRound, Eye, EyeOff, Lightbulb,
} from "lucide-react";
import { Link } from "wouter";

interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  profileImageUrl: string | null;
  role: string;
  authType: string;
  isEmailVerified: boolean;
  passwordHint: string | null;
  createdAt: string;
}

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your new password"),
  passwordHint: z.string().min(1, "Password hint is required").max(255),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function Profile() {
  const { user, isLoading: authLoading, isRegisteredUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
    enabled: isRegisteredUser,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; phone: string }) =>
      apiRequest("/api/profile", "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditing(false);
      toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Update Failed", description: error.message || "Failed to update profile.", variant: "destructive" });
    },
  });

  const changePasswordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "", passwordHint: "" },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordForm) => {
      const res = await apiRequest("/api/profile/change-password", "POST", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        passwordHint: data.passwordHint,
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      changePasswordForm.reset();
      setShowChangePassword(false);
      toast({ title: "Password Changed", description: data.message || "Your password has been updated successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to change password.", variant: "destructive" });
    },
  });

  const handleStartEdit = () => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setPhone(profile.phone || "");
    }
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast({ title: "Invalid File Type", description: "Please upload a JPEG, PNG, WebP, or GIF image.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File Too Large", description: "Please upload an image smaller than 5MB.", variant: "destructive" });
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/profile/image", { method: "POST", body: formData, credentials: "include" });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image");
      }
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Image Uploaded", description: "Your profile picture has been updated." });
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message || "Failed to upload image.", variant: "destructive" });
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin": return "bg-red-100 text-red-800";
      case "admin": return "bg-orange-100 text-orange-800";
      case "content_manager": return "bg-purple-100 text-purple-800";
      case "preferred_client": return "bg-blue-100 text-blue-800";
      case "client": return "bg-green-100 text-green-800";
      case "guest_user": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const formatRole = (role: string) =>
    role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const getInitials = (firstName?: string | null, lastName?: string | null, email?: string | null) => {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (firstName) return firstName.slice(0, 2).toUpperCase();
    if (email) return email.slice(0, 2).toUpperCase();
    return "U";
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isRegisteredUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to view your profile.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild><Link href="/become-client">Sign In</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isTraditionalAuth = profile?.authType === "traditional" || !profile?.authType;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Profile Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                  {profile?.profileImageUrl ? (
                    <AvatarImage src={profile.profileImageUrl} alt="Profile" />
                  ) : null}
                  <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
                    {getInitials(profile?.firstName, profile?.lastName, profile?.email)}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors shadow-md"
                >
                  {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </label>
                <input
                  ref={fileInputRef}
                  id="profile-image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                />
              </div>
            </div>
            <CardTitle className="text-2xl">
              {profile?.firstName && profile?.lastName
                ? `${profile.firstName} ${profile.lastName}`
                : profile?.email}
            </CardTitle>
            <div className="flex justify-center mt-2">
              <Badge className={getRoleBadgeColor(profile?.role || "client")}>
                {formatRole(profile?.role || "client")}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" maxLength={14} />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={() => updateProfileMutation.mutate({ firstName, lastName, phone })} disabled={updateProfileMutation.isPending} className="flex-1">
                    {updateProfileMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={updateProfileMutation.isPending}>
                    <X className="h-4 w-4 mr-2" />Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profile?.email}</p>
                  </div>
                  {profile?.isEmailVerified && (
                    <Badge variant="outline" className="ml-auto text-green-600 border-green-200">
                      <Check className="h-3 w-3 mr-1" />Verified
                    </Badge>
                  )}
                </div>

                {(profile?.firstName || profile?.lastName) && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{[profile?.firstName, profile?.lastName].filter(Boolean).join(" ")}</p>
                    </div>
                  </div>
                )}

                {profile?.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{profile.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Authentication</p>
                    <p className="font-medium capitalize">{profile?.authType || "Traditional"}</p>
                  </div>
                </div>

                {profile?.createdAt && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">
                        {new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                )}

                <Button onClick={handleStartEdit} className="w-full mt-4">
                  <User className="h-4 w-4 mr-2" />Edit Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Card — only for traditional auth */}
        {isTraditionalAuth && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <KeyRound className="h-5 w-5 text-primary" />
                Security
              </CardTitle>
              <CardDescription>Manage your password and recovery hint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Password Hint */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Lightbulb className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Password Hint</p>
                  {profile?.passwordHint ? (
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {showHint ? profile.passwordHint : "••••••••••••"}
                      </p>
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showHint ? "Hide hint" : "Show hint"}
                      >
                        {showHint ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No hint set</p>
                  )}
                </div>
              </div>

              {/* Change Password */}
              {!showChangePassword ? (
                <Button variant="outline" className="w-full" onClick={() => setShowChangePassword(true)}>
                  <KeyRound className="h-4 w-4 mr-2" />Change Password
                </Button>
              ) : (
                <Form {...changePasswordForm}>
                  <form
                    onSubmit={changePasswordForm.handleSubmit((d) => changePasswordMutation.mutate(d))}
                    className="space-y-4 border rounded-lg p-4"
                  >
                    <p className="text-sm font-medium">Change Password</p>

                    <FormField
                      control={changePasswordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={changePasswordForm.control}
                      name="newPassword"
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
                      control={changePasswordForm.control}
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
                      control={changePasswordForm.control}
                      name="passwordHint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password Hint *</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder={profile?.passwordHint || "A hint to help you remember your password"}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            This hint will be shown if you forget your password.
                          </p>
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1" disabled={changePasswordMutation.isPending}>
                        {changePasswordMutation.isPending ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</>
                        ) : (
                          <><Save className="mr-2 h-4 w-4" />Save Password</>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => { setShowChangePassword(false); changePasswordForm.reset(); }}
                        disabled={changePasswordMutation.isPending}
                      >
                        <X className="h-4 w-4 mr-2" />Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
