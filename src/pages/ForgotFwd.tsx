import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { ForgotPasswordValidation } from "@/lib/validation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { resetPassword, sendOTPToEmail } from "@/features/auth/authSlice";
import { InputOTPGroup } from "@/components/ui/input-otp";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { RootState } from "@/store";

const ForgotFwd = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [OTP, setOTP] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector((state: RootState) => state.auth);

  const form = useForm<z.infer<typeof ForgotPasswordValidation>>({
    resolver: zodResolver(ForgotPasswordValidation),
    defaultValues: {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleForgotPassword = async (data: z.infer<typeof ForgotPasswordValidation>) => {
    try {
      const result = await dispatch(sendOTPToEmail(data.email));
      if (result.payload) {
        setOtpSent(true);
        toast.success("Password Reset Email Sent", {
          description: "Please check your email for further instructions.",
        });
      } else {
        toast.error("Error", {
          description: "Failed to send password reset email. Please try again.",
        });
      }
    } catch (error) {
      setOtpSent(false);
      toast.error("Error", {
        description: "Failed to send password reset email. Please try again.",
      });
    }
  };

  const handleResetPassword = async (data: z.infer<typeof ForgotPasswordValidation>) => {
    const resetData = {
      email: data.email,
      token: OTP,
      newPassword: data.confirmPassword,
    };
    await dispatch(resetPassword(resetData));
    navigate("/sign-in");
    toast.success("Password Reset Successfully", {
      description: "Please login to continue.",
    });
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Forgot Password</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Enter your email to reset your password</p>
        <form className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {otpSent && (
            <FormField
              control={form.control}  
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">OTP</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} onComplete={setOTP} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {OTP && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">New Password</FormLabel>
                    <FormControl>
                      <Input type="password" className="shad-input" {...field} />
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
                    <FormLabel className="shad-form_label">Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {OTP ? (
            <Button type="submit" className="shad-button_primary" disabled={isLoading} onClick={() => handleResetPassword(form.getValues())}>
              {isLoading ? (
                <div className="flex-center gap-2">
                  <Loader /> Loading...
                </div>
              ) : (
                "Confirm to Reset Password"
              )}
            </Button>
          ) : (
            <Button type="submit" className="shad-button_primary" disabled={isLoading} onClick={() => handleForgotPassword(form.getValues())}>
              {isLoading ? (
                <div className="flex-center gap-2">
                  <Loader /> Loading...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>
            
          )}
          <p className="text-small-regular text-light-2 text-center mt-2">
            Remember your password?
            <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default ForgotFwd;