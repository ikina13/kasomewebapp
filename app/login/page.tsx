"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Logo from "@/components/Logo";
import PhoneInput from "@/components/PhoneInput";
import { toast } from "sonner"; // Sonner still used for social login or other global notifications

// Interfaces for API Request and Response
interface LoginRequest {
  phone: string;
  password: string;
}

interface LoginResponseData {
  id: number;
  name: string;
  phone: string;
  email: string;
  location: string | null;
  region_id: number | null;
  district_id: number | null;
  role_id: number | null;
  created_by: number | null;
  updated_by: number | null;
  deleted_at: string | null;
  username: string | null;
  sex: string;
  dob: string;
  refresh_token: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  activate_user_token: number;
  status: string;
  region: string;
  district: string;
}

interface LoginApiResponse {
  status: string;
  code: string;
  data: LoginResponseData;
  token: string;
  message: string;
}

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // States for in-form message display (now visually as a "trailing alert")
  const [formMessage, setFormMessage] = useState("");
  const [formMessageType, setFormMessageType] = useState<"success" | "error">("success");

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormMessage(""); // Clear previous form message

    try {
      const loginData: LoginRequest = {
        phone: phoneNumber,
        password: password,
      };

      const response = await fetch("http://45.79.205.240/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result: LoginApiResponse = await response.json();

      if (response.ok && result.status === "SUCCESS") {
        localStorage.setItem("auth_token", result.token);

        if (rememberMe) {
          localStorage.setItem("remember_me", "true");
          localStorage.setItem("remembered_phone", phoneNumber);
        } else {
          localStorage.removeItem("remember_me");
          localStorage.removeItem("remembered_phone");
        }

        localStorage.setItem("user_data", JSON.stringify(result.data));

        setFormMessageType("success");
        setFormMessage(result.message || "Login successful!");

        const redirectTo = searchParams.get('redirect_to');
        // Give a short delay for the message to be seen, then redirect
        setTimeout(() => {
          if (redirectTo) {
            router.push(redirectTo);
          } else {
            router.push("/dashboard");
          }
        }, 1500); // 1.5 second delay
      } else {
        setFormMessageType("error");
        setFormMessage(result.message || "Login failed. Please check your credentials.");
        console.error("Login API Error:", result.message || "Unknown API error");
      }
    } catch (error: any) {
      setFormMessageType("error");
      setFormMessage(`Network error: ${error.message || "Could not connect to the server."}`);
      console.error("Fetch Error:", error);
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const rememberedPhone = localStorage.getItem("remembered_phone");
    if (localStorage.getItem("remember_me") === "true" && rememberedPhone) {
      setPhoneNumber(rememberedPhone);
      setRememberMe(true);
    }

    const handleOnline = () => {
      setIsOffline(false);
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSocialLogin = (provider: string) => {
    if (isOffline) {
      toast.error("Social login requires internet connection");
      return;
    }
    toast.info(`${provider} login coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Kasome account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </div>
              <Link href="/forgot-password" className="text-sm text-yellow-500 hover:text-yellow-600">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isLoading || isOffline}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            {/* Trailing Alert Message Display Area */}
            {formMessage && (
              <div
                className={`mt-4 p-3 rounded-md border text-sm flex items-center ${
                  formMessageType === "success"
                    ? "bg-green-100 text-green-800 border-green-500"
                    : "bg-red-100 text-red-800 border-red-500"
                } transition-all duration-300 ease-in-out transform`}
                // Adding a key to force remount on message change, which can help with animations if you add them
                key={formMessage}
              >
                {formMessageType === "success" ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-2" />
                )}
                <span>{formMessage}</span>
              </div>
            )}
            {isOffline && !formMessage && ( // Only show offline if no other form message is active
              <p className="text-red-500 text-center text-sm mt-2">You are offline. Please check your internet connection.</p>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("Google")}
                disabled={isOffline}
                className="w-full"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("Facebook")}
                disabled={isOffline}
                className="w-full"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-yellow-500 hover:text-yellow-600 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}