import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogClose,
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
      <DialogContent className="bg-dark-2 p-6 h-full lg:h-auto text-light-1 max-w-md lg:max-w-5xl border-dark-4">
        <DialogHeader>
          <DialogTitle className="text-left text-2xl font-medium relative">Create Post
            <DialogClose className="absolute top-0 right-0 flex px-2 py-2 lg:hidden bg-light-2 rounded-full focus:outline-none">
              <img src="/assets/icons/close.svg" alt="close" className="w-5 h-5" />
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto custom-scrollbar-hidden">
          <PostForm action="Create" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog; 