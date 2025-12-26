import { useState } from "react";
import {
  Settings,
  User,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AdminSettingsProps {
  sectorName: string;
  sectorColor?: string;
}

const AdminSettings = ({ sectorName }: AdminSettingsProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Email change state
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    password: "",
  });
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Change email
  const handleChangeEmail = async () => {
    if (!emailForm.newEmail || !emailForm.password) {
      toast({ title: "Error", description: "Please fill all fields.", variant: "destructive" });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.newEmail)) {
      toast({ title: "Error", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    if (emailForm.newEmail === user?.email) {
      toast({ title: "Error", description: "New email must be different from current email.", variant: "destructive" });
      return;
    }

    setIsChangingEmail(true);
    try {
      if (user && user.email) {
        // Re-authenticate user first
        const credential = EmailAuthProvider.credential(user.email, emailForm.password);
        await reauthenticateWithCredential(user, credential);
        
        // Send verification email to new address
        await verifyBeforeUpdateEmail(user, emailForm.newEmail);
        
        toast({ 
          title: "Verification Email Sent", 
          description: `A verification link has been sent to ${emailForm.newEmail}. Please check your inbox and click the link to complete the email change.`,
        });
        setEmailForm({ newEmail: "", password: "" });
      }
    } catch (error: any) {
      console.error("Email change error:", error);
      if (error.code === "auth/wrong-password") {
        toast({ title: "Error", description: "Password is incorrect.", variant: "destructive" });
      } else if (error.code === "auth/email-already-in-use") {
        toast({ title: "Error", description: "This email is already in use by another account.", variant: "destructive" });
      } else if (error.code === "auth/invalid-email") {
        toast({ title: "Error", description: "Invalid email address.", variant: "destructive" });
      } else if (error.code === "auth/requires-recent-login") {
        toast({ title: "Error", description: "Please sign out and sign in again before changing your email.", variant: "destructive" });
      } else {
        toast({ title: "Error", description: error.message || "Failed to change email. Please try again.", variant: "destructive" });
      }
    } finally {
      setIsChangingEmail(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({ title: "Error", description: "Please fill all password fields.", variant: "destructive" });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setIsChangingPassword(true);
    try {
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, passwordForm.currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, passwordForm.newPassword);
        
        toast({ title: "Password Changed", description: "Your password has been updated successfully." });
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error: any) {
      console.error("Password change error:", error);
      if (error.code === "auth/wrong-password") {
        toast({ title: "Error", description: "Current password is incorrect.", variant: "destructive" });
      } else {
        toast({ title: "Error", description: "Failed to change password. Please try again.", variant: "destructive" });
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b] flex items-center gap-3">
          <Settings className="text-[#25A7A1]" />
          Settings
        </h1>
        <p className="text-[#64748b]">Manage your {sectorName} account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} className="text-[#25A7A1]" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={sectorName} disabled className="bg-gray-50 capitalize" />
            </div>

            <div className="space-y-2">
              <Label>Account Created</Label>
              <Input
                value={user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label>Last Sign In</Label>
              <Input
                value={user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : "N/A"}
                disabled
                className="bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Change Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail size={20} className="text-[#25A7A1]" />
              Change Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              A verification link will be sent to your new email address. You must click the link to complete the change.
            </p>
            
            <div className="space-y-2">
              <Label>New Email Address</Label>
              <Input
                type="email"
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))}
                placeholder="Enter new email address"
              />
            </div>

            <div className="space-y-2">
              <Label>Current Password</Label>
              <div className="relative">
                <Input
                  type={showEmailPassword ? "text" : "password"}
                  value={emailForm.password}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password to confirm"
                />
                <button
                  type="button"
                  onClick={() => setShowEmailPassword(!showEmailPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showEmailPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleChangeEmail}
              disabled={isChangingEmail || !emailForm.newEmail || !emailForm.password}
              className="w-full bg-[#25A7A1] hover:bg-[#1F8B86]"
            >
              {isChangingEmail ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Sending Verification...
                </>
              ) : (
                "Change Email"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} className="text-[#25A7A1]" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password (min 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
              className="w-full bg-[#25A7A1] hover:bg-[#1F8B86]"
            >
              {isChangingPassword ? "Changing Password..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
