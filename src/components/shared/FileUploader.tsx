import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "@/components/ui";
import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      fieldChange(acceptedFiles);
      
      if (acceptedFiles.length > 0) {
        const isVideo = acceptedFiles[0].type.startsWith('video/');
        setFileType(isVideo ? "video" : "image");
        setFileUrl(convertFileToUrl(acceptedFiles[0]));
      }
    },
    [fieldChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
      "video/*": [".mp4", ".webm", ".mov"]
    },
    maxFiles: 10,
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" multiple />

      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-2 lg:p-4">
            {fileType === "video" ? (
              <video 
                src={fileUrl} 
                className="file_uploader-img" 
                controls 
              />
            ) : (
              <img 
                src={fileUrl} 
                alt="uploaded media" 
                className="file_uploader-img" 
              />
            )}
          </div>
          <p className="file_uploader-label">
            Click or drag {fileType === "video" ? "video" : "photos"} to replace
          </p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file upload"
          />

          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag media here
          </h3>
          <p className="text-light-4 small-regular mb-6">PNG, JPG, MP4, WEBM</p>

          <Button type="button" className="shad-button_dark_4">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
