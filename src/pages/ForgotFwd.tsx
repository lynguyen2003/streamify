import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ForgotPasswordValidation } from "@/lib/validation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";

const ForgotFwd = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof ForgotPasswordValidation>>({
    resolver: zodResolver(ForgotPasswordValidation),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = async (data: z.infer<typeof ForgotPasswordValidation>) => {
    try {
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for further instructions.",
      });
      navigate("/sign-in");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Forgot Password</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Enter your email to reset your password</p>
        <form onSubmit={form.handleSubmit(handleForgotPassword)} className="flex flex-col gap-5 w-full mt-4">
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
          <Button type="submit" className="shad-button_primary">
            {form.formState.isSubmitting ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Send Reset Link"
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

export default ForgotFwd;