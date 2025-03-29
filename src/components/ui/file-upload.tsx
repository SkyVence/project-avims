"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { UploadDropzone } from "@uploadthing/react";
import { X } from "lucide-react";
import { Button } from "./button";
import { OurFileRouter } from "../../app/api/uploadthing/core";

interface FileUploadProps {
  value: Array<{ url: string; key: string }>;
  onChange: (files: Array<{ url: string; key: string }>) => void;
  onRemove: (key: string) => void;
  endpoint: "imageUploader"; // This enforces the literal type
  disabled?: boolean;
}

export function FileUpload({
  value,
  onChange,
  onRemove,
  endpoint,
  disabled = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const hasImage = value.length > 0;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024, // 4MB
    accept: generateClientDropzoneAccept(["image"]),
    disabled: hasImage || isUploading || disabled,
    onDrop: () => {}, // We're not using this since UploadThing handles the upload
  });

  // Display the image if one exists
  if (hasImage) {
    return (
      <div className="relative rounded-md overflow-hidden border border-gray-200 w-full aspect-video">
        <div className="absolute top-2 right-2 z-10">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => onRemove(value[0].key)}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Image
          fill
          src={value[0].url}
          alt="Uploaded image"
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  // Show the upload dropzone if no image exists
  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-md p-4 w-full transition-colors
        ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <div className="flex flex-col items-center justify-center">
        <UploadDropzone<OurFileRouter, "imageUploader">
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            if (res && res.length > 0) {
              // Format files to match the expected schema
              const files = res.map((file) => ({
                url: file.ufsUrl,
                key: file.key,
              }));
              onChange(files);
            }
            setIsUploading(false);
          }}
          onUploadBegin={() => {
            setIsUploading(true);
          }}
          onUploadError={(error) => {
            console.error("Upload error:", error);
            setIsUploading(false);
          }}
          config={{
            mode: "auto",
            maxFileSize: "4mb",
            maxFileCount: 1 
          }}
          className="ut-button:bg-primary ut-label:text-primary w-full h-[200px] flex flex-col items-center justify-center"
          content={{
            label: isDragActive
              ? "Drop image here"
              : "Drag & drop or click to upload",
            allowedContent: "Image (max 4MB)",
          }}
        />
      </div>
    </div>
  );
}
