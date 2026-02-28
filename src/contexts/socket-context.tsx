"use client";

import { useSpeakingSocket } from "@/hooks";
import React, { createContext, useContext } from "react";


const SocketContext = createContext<any>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    // notification socket hoạt động cả khi có hoặc không có token
    const speakingSocket = useSpeakingSocket();
    // const chatSocket = useChatSocket(token || "");

    return (
        <SocketContext.Provider value={{ speakingSocket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSockets = () => useContext(SocketContext);
