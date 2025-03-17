import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

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
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { SignupValidation } from "@/lib/validation";

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      console.log(user);
      navigate("/");
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>

        {/* Add social login buttons */}
        <div className="flex flex-col gap-3 w-full mt-4">
          <Button 
            type="button" 
            className="flex items-center justify-center gap-2 w-full bg-white text-black hover:bg-gray-200"
          >
            <img src="/assets/icons/google.svg" alt="google" className="w-5 h-5" />
            Continue with Google
          </Button>

          <div className="flex items-center gap-2 w-full my-2">
            <div className="flex-1 h-[1px] bg-gray-500"></div>
            <p className="text-light-3 text-sm">or</p>
            <div className="flex-1 h-[1px] bg-gray-500"></div>
          </div>
        </div>

        <p className="text-light-3 small-medium md:base-regular mt-2">
          When's your birthday?
        </p>

        {/* Date of birth selectors */}
        <div className="flex gap-2 w-full mt-4">
          <select className="shad-input flex-1">
            <option>February</option>
            {/* Add other months */}
          </select>
          <select className="shad-input w-24">
            <option>2</option>
            {/* Add other days */}
          </select>
          <select className="shad-input w-24">
            <option>2023</option>
            {/* Add other years */}
          </select>
        </div>
        
        <p className="text-light-3 text-sm mt-2">
          Your birthday won't be shown publicly.
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="text" 
                    className="shad-input" 
                    placeholder="Email address"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="password" 
                    className="shad-input" 
                    placeholder="Password"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Input 
              type="text" 
              className="shad-input" 
              placeholder="Enter 6-digit code"
            />
            <Button type="button" className="shad-button_primary h-12">
              Send code
            </Button>
          </div>

          <Button type="submit" className="shad-button_primary">
            Continue
          </Button>

          <p className="text-light-3 text-sm text-center">
            By continuing with an account located in Vietnam, you agree to our 
            <a href="#" className="text-primary-500"> Terms of Service</a> and confirm that you have read our 
            <a href="#" className="text-primary-500"> Privacy Policy</a>.
          </p>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default Register;
