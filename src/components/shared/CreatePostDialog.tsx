import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import PostForm from "@/components/forms/PostForm";

type CreatePostDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreatePostDialog = ({ isOpen, onOpenChange }: CreatePostDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-dark-2/30" />
      <DialogContent className="bg-dark-2 p-6 text-light-1 max-w-md lg:max-w-5xl border-dark-4">
        <DialogHeader>
          <DialogTitle className="text-left text-2xl font-medium">Create Post</DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto custom-scrollbar-hidden">
          <PostForm action="Create" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog; 