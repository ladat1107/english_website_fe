"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ImagePreviewContextType = {
    imageUrl: string | null;
    openImage: (url: string) => void;
    closeImage: () => void;
};

const ImagePreviewContext = createContext<ImagePreviewContextType | null>(null);

export const ImagePreviewProvider = ({ children }: { children: ReactNode }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const openImage = (url: string) => setImageUrl(url);
    const closeImage = () => setImageUrl(null);

    return (
        <ImagePreviewContext.Provider value={{ imageUrl, openImage, closeImage }}>
            {children}
        </ImagePreviewContext.Provider>
    );
};

export const useImagePreview = () => {
    const ctx = useContext(ImagePreviewContext);
    if (!ctx) throw new Error("useImagePreview must be used inside provider");
    return ctx;
};