import React from "react";
import {
    FileText,
    FileArchive,
    FileImage,
    FileVideo,
    FileSpreadsheet,
    File,
    FileCode,
    Presentation,
} from "lucide-react";
import dayjs from "dayjs";
import { FileInfo } from "@/types/writing.type";
import Image from "next/image";


type Props = {
    file: FileInfo;
    onClick?: (file: FileInfo) => void;
};

const getFileExtension = (url: string) => {
    return url.split(".").pop()?.toLowerCase() || "";
};

const getColor = (type?: string, name?: string) => {
    const ext = (type || name || "").toLowerCase();

    if (ext.includes("pdf")) return "text-red-500";
    if (ext.match(/doc|docx/)) return "text-blue-500 ";
    if (ext.match(/xls|xlsx|csv/)) return "text-green-500 ";
    if (ext.match(/ppt|pptx/)) return "text-orange-500 ";
    if (ext.match(/zip|rar|7z/)) return "text-yellow-500 ";
    if (ext.match(/png|jpg|jpeg|gif|webp/)) return "text-purple-500 ";

    return "text-gray-500 bg-gray-100";
};
export const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";

    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};
const getIcon = (ext: string) => {
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext))
        return <FileImage className="w-8 h-8" />;
    if (["pdf", "doc", "docx"].includes(ext))
        return <FileText className="w-8 h-8" />;
    if (["xls", "xlsx", "csv"].includes(ext))
        return <FileSpreadsheet className="w-8 h-8" />;
    if (["ppt", "pptx"].includes(ext))
        return <Presentation className="w-8 h-8" />;
    if (["zip", "rar", "7z"].includes(ext))
        return <FileArchive className="w-8 h-8" />;
    if (["mp4", "mov", "webm"].includes(ext))
        return <FileVideo className="w-8 h-8" />;
    if (["js", "ts", "json", "html", "css"].includes(ext))
        return <FileCode className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
};

const isImage = (ext: string) => {
    return ["png", "jpg", "jpeg", "gif", "webp"].includes(ext);
};

const FileCard: React.FC<Props> = ({ file, onClick }) => {
    const ext = getFileExtension(file.url);
    const color = getColor(ext, file.name);

    return (
        <div
            onClick={() => onClick?.(file)}
            className="
        group relative w-full
        aspect-square
        rounded-2xl
        border
        bg-white dark:bg-neutral-900
        hover:shadow-lg
        transition
        cursor-pointer
        overflow-hidden
      "
        >
            {/* Preview */}
            <div className="w-full h-full flex items-center justify-center">
                {isImage(ext) && file.url ? (
                    <Image
                        src={file.url}
                        alt={file.name || "File" + dayjs().format("YYYYMMDDHHmmss")}
                        className="w-full h-full object-cover"
                        fill
                    />
                ) : (
                    <div className={`flex flex-col items-center gap-2 pb-8 ${color}`}>
                        {getIcon(ext)}
                        <span className="text-xs uppercase font-semibold">{ext}</span>
                    </div>
                )}
            </div>

            {/* Overlay */}
            <div
                className="
          absolute bottom-0 left-0 right-0
          bg-gradient-to-t from-black/60 to-transparent
          text-white
          p-2          
          transition
        "
            >
                <p className="text-xs truncate">{file.name}</p>
                {file.size && (
                    <div className="text-[10px] opacity-80">
                        {formatFileSize(file.size)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileCard;