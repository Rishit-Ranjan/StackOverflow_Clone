import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useState, FormEvent } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosinstance";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePassword = () => {
    const length = 12;
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const characters = uppercase + lowercase;
    let password = "";
    for (let i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setNewPassword(password);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required");
      return;
    }
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      setMessage(response.data.message);
      if (response.data.password) {
        setNewPassword(response.data.password);
      }
      toast.success(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 lg:mb-8">
          <Link href="/" className="flex items-center justify-center mb-4">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-orange-500 rounded mr-2 flex items-center justify-center">
              <div className="w-4 h-4 lg:w-6 lg:h-6 bg-white rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 lg:w-4 lg:h-4 bg-orange-500 rounded-sm"></div>
              </div>
            </div>
            <span className="text-lg lg:text-xl font-bold text-gray-800">
              stack<span className="font-normal">overflow</span>
            </span>
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-xl lg:text-2xl">
                Forgot Password
              </CardTitle>
              <CardDescription>
                Enter your email to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
                disabled={loading}
              >
                {loading ? "Sending..." : "Reset Password"}
              </Button>
              <div className="space-y-2">
                <Label htmlFor="new-password">Generated Password</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="new-password"
                    type="text"
                    readOnly
                    value={newPassword}
                    placeholder="Click generate to get a new password"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generatePassword}
                  >
                    Generate
                  </Button>
                </div>
                {newPassword && (
                  <p className="text-xs text-gray-500">
                    This is your new temporary password. Please save it and
                    change it after logging in.
                  </p>
                )}
              </div>
              {message && <p className="text-green-500">{message}</p>}
              {error && <p className="text-red-500">{error}</p>}
              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link href="/auth" className="text-blue-600 hover:underline">
                  Log in
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
