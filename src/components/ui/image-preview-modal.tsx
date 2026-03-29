"use client";
import Image from "next/image";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useImagePreview } from "@/contexts/image-preview-context";

export const getFileType = (url: string) => {
    const ext = url.split("?")[0].split(".").pop()?.toLowerCase();

    if (!ext) return "unknown";

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext))
        return "office";

    return "unknown";
};
export default function FilePreviewModal() {
    const { imageUrl, closeImage } = useImagePreview();

    if (!imageUrl) return null;

    const type = getFileType(imageUrl);

    // Convert office files -> Google Docs Viewer
    const googleViewerUrl =
        type === "office"
            ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                imageUrl
            )}`
            : imageUrl;

    return (
        <Dialog open={!!imageUrl} onOpenChange={closeImage}>
            <DialogContent
                className="max-w-[95vw] md:max-w-3xl max-h-[90vh] p-0 border-none shadow-xl"
                showCloseButton={false}
            >
                <div className="relative w-full h-full">
                    {/* Nút đóng */}
                    <DialogClose className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-1">
                        <X className="w-5 h-5" />
                    </DialogClose>                  

                    {/* Nội dung preview */}
                    <div className="w-full h-[90vh] flex items-center justify-center p-4">
                        {type === "image" && (
                            <Image
                                src={imageUrl}
                                alt="preview"
                                width={1200}
                                height={1200}
                                className="max-h-full w-auto rounded-lg"
                            />
                        )}

                        {type === "pdf" && (
                            <iframe
                                src={imageUrl}
                                className="w-full h-full rounded-lg pt-6"
                            />
                        )}

                        {type === "office" && (
                            <iframe
                                src={googleViewerUrl}
                                className="w-full h-full rounded-lg pt-6"
                            />
                        )}

                        {type === "unknown" && (
                            <iframe
                                src={imageUrl}
                                className="w-full h-full rounded-lg"
                            />
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}