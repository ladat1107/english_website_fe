/**
 * Khailingo - FlashcardImagePicker
 * Compact image picker với tabs Preset/Upload
 */

"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiImage, FiUpload, FiX, FiCheck, FiLoader } from "react-icons/fi";
import { cn } from "@/utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";
import { CloudinaryFolder } from "@/lib/cloudinary";
import { PRESET_IMAGES } from "./preset-images";

interface FlashcardImagePickerProps {
  value?: string;
  onChange: (url: string) => void;
  onUploading?: (isUploading: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function FlashcardImagePicker({
  value,
  onChange,
  onUploading,
  disabled = false,
  className,
}: FlashcardImagePickerProps) {
  const [open, setOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { isUploading, progress, uploadImage } = useCloudinaryUpload({
    folder: CloudinaryFolder.GENERAL_IMAGES,
    onSuccess: (result) => {
      onChange(result.versionedUrl || result.url);
      setOpen(false);
    },
  });

  // Notify parent about uploading state
  React.useEffect(() => {
    onUploading?.(isUploading);
  }, [isUploading, onUploading]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePresetSelect = (url: string) => {
    onChange(url);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  // Filter preset images có URL
  const availablePresets = PRESET_IMAGES.filter((img) => img.url);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            "relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg border-2 border-dashed border-muted-foreground/30",
            "flex items-center justify-center",
            "hover:border-primary/50 hover:bg-primary/5 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            disabled && "opacity-50 cursor-not-allowed",
            value && "border-separate border-gray-300",
            className
          )}
        >
          {value ? (
            <>
              <Image
                src={value}
                alt="Selected"
                fill
                className="object-cover rounded-md"
              />
              {/* Clear button */}
              <button
                type="button"
                onClick={handleClear}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
              >
                <FiX className="w-3 h-3" />
              </button>
            </>
          ) : (
            <FiImage className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
          )}

          {/* Uploading overlay */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 rounded-md flex items-center justify-center"
              >
                <div className="text-center">
                  <FiLoader className="w-4 h-4 animate-spin mx-auto text-primary" />
                  <span className="text-xs text-muted-foreground mt-1">{progress}%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-72 sm:w-80 p-3" align="start">
        <Tabs defaultValue="preset" className="w-full">
          <TabsList variant="default" className="w-full grid grid-cols-2 h-9">
            <TabsTrigger value="preset" className="text-xs sm:text-sm" disabled={availablePresets.length === 0}>
              <FiImage className="w-3.5 h-3.5 mr-1.5" />
              Mẫu có sẵn
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-xs sm:text-sm">
              <FiUpload className="w-3.5 h-3.5 mr-1.5" />
              Tải lên
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="mt-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer",
                "hover:border-primary/50 hover:bg-primary/5 transition-all",
                isUploading && "pointer-events-none opacity-50"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <FiUpload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click để chọn ảnh
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                PNG, JPG tối đa 5MB
              </p>
            </div>

            {/* Upload progress */}
            {isUploading && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Đang tải lên...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* Preset Tab */}
          <TabsContent value="preset" className="mt-3">
            {availablePresets.length > 0 ? (
              <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto">
                {availablePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset.url)}
                    className={cn(
                      "relative aspect-square rounded-md overflow-hidden",
                      "border-2 transition-all",
                      value === preset.url
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-primary/50"
                    )}
                  >
                    <Image
                      src={preset.url}
                      alt={preset.alt}
                      fill
                      className="object-cover"
                    />
                    {value === preset.url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <FiCheck className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <FiImage className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chưa có ảnh mẫu</p>
                <p className="text-xs opacity-70">Sẽ được cập nhật sau</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Clear button nếu đang có ảnh */}
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="w-full mt-3 text-destructive hover:text-destructive"
          >
            <FiX className="w-4 h-4 mr-1.5" />
            Xóa ảnh
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default FlashcardImagePicker;
