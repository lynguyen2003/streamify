import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea, Input, Button } from "@/components/ui";
import { ProfileUploader, Loader } from "@/components/shared";
import { toast } from "sonner";

import { UpdateUserSchema } from "@/lib/validation";
import { useAppSelector } from "@/hooks/useAppSelector";
import { RootState } from "@/store";
import { useUpdateUserMutation } from "@/lib/api/react-queries";

const UpdateProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user: currentUser } = useAppSelector((state: RootState) => state.auth);
    const { updateUser, loading } = useUpdateUserMutation();

    const form = useForm<z.infer<typeof UpdateUserSchema>>({
        resolver: zodResolver(UpdateUserSchema),
        defaultValues: {
            email: currentUser?.email,
            username: currentUser?.username,
            phone: currentUser?.phone,
            imageUrl: currentUser?.imageUrl,
            bio: currentUser?.bio,
        },
    });

    if (!currentUser)
        return (
        <div className="flex-center w-full h-full">
            <Loader />
        </div>
    );

    // Handler
    const handleUpdate = async (values: z.infer<typeof UpdateUserSchema>) => {
        const updatedUser = { 
            email: values.email,
            username: values.username,
            phone: values.phone,
            bio: values.bio,
            imageUrl: values.imageUrl,
        }
        const resultAction = await updateUser(updatedUser);

        if (resultAction.data) {
            toast.success("Profile updated successfully");
            window.location.href = `/profile/${id}`;
        } else {
            toast.error('Failed to update profile');
        }
    };

    return (
        <div className="flex flex-1">
        <div className="common-container">
            <div className="flex-start gap-3 justify-start w-full max-w-5xl">
            <img
                src="/assets/icons/edit.svg"
                width={36}
                height={36}
                alt="edit"
                className="invert-white"
            />
            <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
            </div>

            <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleUpdate)}
                className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                    <FormItem className="flex">
                        <FormControl>
                            <ProfileUploader
                            fieldChange={field.onChange}
                            mediaUrl={currentUser.imageUrl}
                            />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="shad-form_label">Username</FormLabel>
                    <FormControl>
                        <Input type="text" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="shad-form_label">Phone</FormLabel>
                    <FormControl>
                        <Input
                        type="text"
                        className="shad-input"
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
                    <FormLabel className="shad-form_label">Email</FormLabel>
                    <FormControl>
                        <Input
                        type="text"
                        className="shad-input"
                        {...field}
                        disabled
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="shad-form_label">Bio</FormLabel>
                    <FormControl>
                        <Textarea
                        className="shad-textarea custom-scrollbar"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                    </FormItem>
                )}
                />

                <div className="flex gap-4 items-center justify-end">
                <Button
                    type="button"
                    className="shad-button_dark_4"
                    onClick={() => navigate(-1)}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="shad-button_primary whitespace-nowrap"
                    >
                    {loading && <Loader />}
                    Update Profile
                </Button>
                </div>
            </form>
            </Form>
        </div>
        </div>
    );
};

export default UpdateProfile;