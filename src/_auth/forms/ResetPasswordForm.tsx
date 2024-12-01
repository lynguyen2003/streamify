import { useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ResetPasswordValidation } from "@/lib/validation";
import { useResetPassword } from "@/lib/react-query/queries";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";

const ResetPasswordForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: resetPassword } = useResetPassword();

  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');

  const form = useForm<z.infer<typeof ResetPasswordValidation>>({
    resolver: zodResolver(ResetPasswordValidation),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!userId || !secret) {
      toast({
        title: "Invalid reset link",
        description: "Please request a new password reset link.",
      });
      navigate('/forgot-password');
    }
  }, [userId, secret, navigate, toast]);

  const handleSubmit = async (values: z.infer<typeof ResetPasswordValidation>) => {
    if (!userId || !secret) return;

    try {
      setIsLoading(true);
      await resetPassword({
        userId,
        secret,
        password: values.confirmPassword
      });

      toast({
        title: "Password Reset Successful",
        description: "You can now sign in with your new password.",
      });
      
      navigate('/sign-in');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Reset Password</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Enter your new password</p>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5 w-full mt-4">
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
          <Button type="submit" className="shad-button_primary">
            {isLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Reset Password"
            )}
          </Button>
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

export default ResetPasswordForm;