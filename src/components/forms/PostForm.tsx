import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";

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
import { CREATE_POST } from "@/graphql/mutations";
import { toast } from "sonner";
import { convertFileToUrl } from "@/lib/utils";

type PostFormProps = {
  post?: IPost;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  
  const [createPost] = useMutation(CREATE_POST);

  // Extract user IDs from IUser objects for mentions
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
  
  // Validate and set files
  const handleFileChange = (uploadedFiles: File[]) => {
    if (uploadedFiles.length === 0) {
      setFiles([]);
      setFileType(null);
      setMediaPreview([]);
      return;
    }

    const isVideo = uploadedFiles[0].type.startsWith('video/');
    
    if (isVideo) {
      if (uploadedFiles.length > 1) {
        toast.error("Only one video can be uploaded");
        return;
      }
      setFileType("video");
      setFiles([uploadedFiles[0]]);

      const videoUrl = URL.createObjectURL(uploadedFiles[0]);
      setMediaPreview([videoUrl]);
    } else {
      if (uploadedFiles.length > 10) {
        toast.error("Maximum 10 images allowed");
        return;
      }
      setFileType("image");
      setFiles(uploadedFiles);
    
      const imageUrls = uploadedFiles.map(file => URL.createObjectURL(file));
      setMediaPreview(imageUrls);
    }
  };
  
  useEffect(() => {
    return () => {
      mediaPreview.forEach(url => URL.revokeObjectURL(url));
    };
  }, [mediaPreview]);
  
  const handleSubmit = async (values: z.infer<typeof PostValidation>) => {
    try {
      setIsLoading(true);      
      if (files.length === 0) {
        toast.error("Please upload at least one image or video");
        setIsLoading(false);
        return;
      }
      
      // In production, you'd upload files to storage and get URLs
      // For now, we'll use the local URLs for demonstration
      const mediaUrls = files.map(file => convertFileToUrl(file));
        
      const postInput: ICreatePost = {
        caption: values.caption,
        mediaUrls: mediaUrls,
        type: "post",
        location: values.location,
        tags: values.tags,
        mentions: values.mentions,
        privacy: values.privacy,
        audio: { name: "", artist: "", url: "" },
        duration: 0
      };
      
      const { data } = await createPost({
        variables: {
          input: postInput
        }
      });
      
      if (data?.addPost) {
        toast.success("Post created successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col lg:flex-row gap-2 justify-between p-1"
      >
        <div className="flex flex-col gap-2 w-full lg:w-2/3">
          <FormLabel className="shad-form_label">
            {fileType === "video" ? "Add Video" : "Add Photos (Max 10)"}
          </FormLabel>
          
          {/* File Uploader */}
          <FileUploader
            fieldChange={handleFileChange}
            mediaUrl={mediaPreview[0] || ""}
          />
          
          {/* Preview multiple images if uploaded more than one */}
          {fileType === "image" && mediaPreview.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {mediaPreview.slice(1).map((url, index) => (
                <div 
                  key={index} 
                  className="aspect-square rounded-lg overflow-hidden bg-dark-4"
                >
                  <img 
                    src={url} 
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Video preview if it's a video */}
          {fileType === "video" && mediaPreview[0] && (
            <div className="mt-3 w-full">
              <video 
                controls 
                className="w-full rounded-lg"
                src={mediaPreview[0]}
              />
            </div>
          )}
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                  {action === "Create" ? "Creating..." : "Updating..."}
                </>
              ) : (
                `${action} Post`
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
