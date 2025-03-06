"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";


interface FileUploadProps {
    onSuccess : (res : IKUploadResponse) => void
    onProgress? : (progress : number) => void
    fileType? : "image" | "video"
}

export default function FileUpload({onSuccess, onProgress, fileType}: FileUploadProps) {

  const [Uploading, setUploading] = useState(false)
  const [Error, setError] = useState<string | null>(null)

  const onError = (err : {message : string}) => {
    console.log("Error", err);
    setError(err.message)
    setUploading(false)
  };
  
  const handleSuccess = (response : IKUploadResponse) => {
    console.log("Success", response);
    setUploading(false)
    setError(null)
    onSuccess(response)
  };
  
  const handleProgress = (evt : ProgressEvent) => {

    if(evt.lengthComputable && onProgress){
        const percentComplete = (evt.loaded / evt.total) * 100
        onProgress(Math.round(percentComplete))
    }

  }

  
  const handleStart = () => {
    setUploading(true)
    setError(null)
  };

  const validateFile = (file : File) => {
    if(fileType == 'video'){
        if(!file.type.startsWith('video/')){
            setError('Please Upload video file')
            return false    
        }
        if (file.size > 100 * 1024 * 1024 ) {
            setError('Video must be lesss than 100 MB')
            return false
        }
    } else {
        const validtypes = ['image/jpeg', 'image/png', 'image/webp']
        if(!validtypes.includes(file.type)){
            setError("Please upload a valid image type (JPEG, PNG, webP)")
            return false
        }
        if (file.size > 5 * 1024 * 1024 ) {
            setError('Image must be lesss than 5 MB')
            return false
        }
    }

    return true

    
  }

  return (
    <div className="space-y-2">
        <IKUpload
          fileName={fileType == 'video' ? 'video' : 'image'}
          useUniqueFileName={true}
          validateFile={validateFile}
          onError={onError}
          onSuccess={handleSuccess}
          onUploadProgress={handleProgress}
          onUploadStart={handleStart}
          folder={fileType == 'video' ? '/videos' : '/images'}
          accept={fileType == 'video' ? 'video/*' : 'image/*'}
          className="file-input file-input-bodered w-full"
        />
        {
            Uploading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="animate-spin w-4 h-4"/>
                    <span>Uploading...</span>
                </div>
            )
        }
        { Error && <div className="text-error text-sm">{Error}</div>}
    </div>
  );
}
