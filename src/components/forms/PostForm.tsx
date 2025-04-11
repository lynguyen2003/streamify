import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { PostValidation } from "@/lib/validation";
import { FileUploader } from "@/components/shared";
import { IPost, ICreatePost, IUser } from "@/types";
import { useCreatePostMutation } from "@/lib/api/react-queries";

type PostFormProps = {
  post?: IPost;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const [ files, setFiles ] = useState<File[]>([]);

  const { createPost, loading } = useCreatePostMutation();

  const extractUserIds = (users: IUser[] | undefined): string[] => {
    if (!users) return [];
    return users.map(user => user._id);
  };

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post.caption : "",
      mediaUrls: post ? post.mediaUrls : [],
      type: post ? post.type : "post",
      location: post ? post.location : "",
      tags: post ? post.tags : [],
      mentions: post ? extractUserIds(post.mentions) : [],
      privacy: post ? (post.privacy as "public" | "private" | "followers" | "friends") : "public",
    },
  });

  const handleFileChange = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  async function handleSubmit(values: z.infer<typeof PostValidation>) {
    try {
      if (files.length === 0) {
        toast.error("Please select a file to upload");
        return;
      }
      
      let baseUrl = import.meta.env.VITE_BASE_URL;
      let uploadUrl = `${baseUrl}/api/${files.length === 1 ? 'upload' : 'upload-multiple'}`;

      const mediaUrls = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        
        try {
          const response = await fetch(uploadUrl, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`Upload failed with status ${response.status}`);
          }
          
          const data = await response.json();
          mediaUrls.push(data.mediaUrl);

        } catch (error) {
          console.error(`Error uploading file ${i + 1}:`, error);
          toast.error(`Failed to upload file ${i + 1}`);
          return;
        }
      }

      const postInput: ICreatePost = {
        caption: values.caption,
        mediaUrls: mediaUrls,
        type: values.type,
        location: values.location,
        tags: values.tags,
        mentions: values.mentions,
        privacy: values.privacy,
        audio: { name: "", artist: "", url: "" },
        duration: 0
      };
      
      const { data } = await createPost(postInput);
      
      if (data?.addPost) {
        toast.success("Post created successfully");
        navigate(0);
      }
    } catch (error) {
      console.error("Post submission error:", error);
      toast.error("Failed to create post");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col lg:flex-row gap-2 justify-between"
      >
        <div className="flex flex-col gap-2 w-full lg:w-2/3">
          
          <FormField
            control={form.control}
            name="mediaUrls"
            render={() => (
              <div className="flex flex-col gap-2 w-full">
                <FileUploader 
                  fieldChange={handleFileChange} 
                  mediaUrl={post?.mediaUrls?.[0] || ""}
                />
              </div>
            )}
          />
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-1/3">
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="shad-form_label">Caption</FormLabel>
                <FormControl>
                  <Textarea
                    className="shad-textarea custom-scrollbar"
                    {...field}
                    maxLength={150}
                    onChange={(e) => {
                      if (e.target.value.length <= 150) {
                        field.onChange(e);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
                <p className={`text-right text-xs text-gray-500 ${(field.value?.length || 0) >= 150 ? "text-red-500" : ""}`}>
                  {field.value?.length || 0} / 150
                </p>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="mentions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">
                  Mentions (separated by comma " , ")
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="@username1, @username2"
                    type="text"
                    className="shad-input"
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const mentions = inputValue
                        .split(',')
                        .map(mention => mention.trim().startsWith('@') 
                          ? mention.trim().substring(1) 
                          : mention.trim())
                        .filter(Boolean);
                      
                      field.onChange(mentions);
                    }}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
                {field.value && field.value.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {field.value.map((mention, index) => (
                      <span 
                        key={index}
                        className="bg-primary-500 text-light-1 px-2 py-1 rounded-full text-xs"
                      >
                        @{mention}
                      </span>
                    ))}
                  </div>
                )}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="privacy"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Privacy</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="shad-input">
                      <SelectValue placeholder="Select privacy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-dark-3 text-light-1 border-dark-4">
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="followers">Followers</SelectItem>
                    <SelectItem value="friends">Friends</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Location</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">
                  Hashtags (separated by comma " , ")
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Art, Expression, Learn"
                    type="text"
                    className="shad-input"
                    onChange={(e) => {
                      const tags = e.target.value
                        .split(',')
                        .map(tag => tag.trim().startsWith('#') 
                          ? tag.trim().substring(1) 
                          : tag.trim())
                        .filter(Boolean);
                      
                      field.onChange(tags);
                    }}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
                {field.value && field.value.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {field.value.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-dark-4 text-light-2 px-2 py-1 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              className="shad-button_primary whitespace-nowrap"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                  {action === "Create" ? "Creating..." : "Updating..."}
                </>
              ) : (
                `${action}`
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
