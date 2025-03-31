"use client"

import { toast } from "@/hooks/use-toast"
import { formatBytes } from "@/lib/utils"
import { FileIcon, Image as ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "../ui/button"

type UploadedImage = {
	url: string
	key: string
}

interface ImageUploadProps {
	value: UploadedImage[]
	onChange: (value: UploadedImage[]) => void
	onFilesChange: (files: File[]) => void
	pendingFiles: File[]
	disabled?: boolean
}

export function ImageUpload({ 
	value, 
	onChange, 
	onFilesChange, 
	pendingFiles, 
	disabled 
}: ImageUploadProps) {
	const removeFile = (index: number) => {
		const newFiles = [...pendingFiles];
		newFiles.splice(index, 1);
		onFilesChange(newFiles);
	}
  
	const removeUploadedImage = (key: string) => {
		onChange(value.filter(image => image.key !== key))
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = e.target.files
		if (!selectedFiles) return

		const newFiles = Array.from(selectedFiles)
		onFilesChange([...pendingFiles, ...newFiles])
	}

	const getFileExtension = (filename: string) => {
		return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 relative">
				<input
					type="file"
					id="file-upload"
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					onChange={handleFileChange}
					accept="image/*"
					multiple
					disabled={disabled}
				/>
				<div className="flex flex-col items-center justify-center text-center">
					<ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
					<h3 className="font-medium text-lg">Drag images here or click to browse</h3>
					<p className="text-sm text-muted-foreground mt-1">
						Upload images up to 4MB each
					</p>
				</div>
			</div>

			{value.length > 0 && (
				<div className="space-y-2">
					<div className="text-sm font-medium">Uploaded Images:</div>
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
						{value.map((image) => (
							<div key={image.key} className="relative group rounded-md overflow-hidden aspect-square">
								<Image
									src={image.url}
									alt="Uploaded image"
									fill
									className="object-cover"
									sizes="(max-width: 768px) 100vw, 33vw"
								/>
								<div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
									<Button 
										variant="destructive" 
										size="icon" 
										className="h-8 w-8"
										onClick={() => removeUploadedImage(image.key)}
										disabled={disabled}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{pendingFiles.length > 0 && (
				<div className="space-y-2">
					<div className="text-sm font-medium">Selected Files (will upload on form submit):</div>
					<div className="space-y-2">
						{pendingFiles.map((file, index) => (
							<div key={index} className="flex items-center justify-between bg-muted p-3 rounded-md">
								<div className="flex items-center space-x-3">
									<FileIcon className="h-5 w-5 text-muted-foreground" />
									<div>
										<div className="font-medium">{file.name}</div>
										<div className="text-xs text-muted-foreground">
											{getFileExtension(file.name).toUpperCase()} • {formatBytes(file.size)}
										</div>
									</div>
								</div>
								<Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={disabled}>
									<X className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
