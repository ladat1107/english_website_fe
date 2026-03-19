"use client";

import { initSocket } from "@/lib/socket";
import { OnlineUser } from "@/types/speaking.type";
import { UserType } from "@/types/user.type";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";


export const useSpeakingSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const isAuthenticatedRef = useRef<boolean>(false);
    const pendingJoinRef = useRef<{ topic: string; examId: string } | null>(null);


    const [onlineUsers, setOnlineUsers] = useState<UserType[] | []>([]);

    useEffect(() => {
        // init socket (có hoặc không có token)
        const socket = initSocket({ namespace: "speaking" });
        socketRef.current = socket;
        isAuthenticatedRef.current = false;

        socket.on("connect", () => {
            //console.log("🔔 Connected to speaking socket:", socket.id);
            // Reset authentication status khi reconnect
            isAuthenticatedRef.current = false;
        });

        // ✅ Chờ authentication hoàn tất từ backend
        socket.on("authenticated", () => {
            isAuthenticatedRef.current = true;

            // Nếu có pending join request, thực hiện ngay
            if (pendingJoinRef.current) {
                const { topic, examId } = pendingJoinRef.current;
                socket.emit("join_room", { topic, examId });
                pendingJoinRef.current = null;
            }
        });

        socket.on("room_users_update", (data: OnlineUser) => {
            if (data && data.users) {
                setOnlineUsers(data.users);
            }
        });

        socket.on("connect_error", (err) => {
            console.error("CONNECT ERROR:", err.message);
        });


        return () => {
            setOnlineUsers([]);
            isAuthenticatedRef.current = false;
            pendingJoinRef.current = null;
            socket.off("authenticated");
            socket.off("connect_error");
            socket.off("room_users_update");
            socket.disconnect();
        };
    }, []);

    const joinRoom = useCallback((topic: string, examId: string) => {
        const socket = socketRef.current;
        if (!socket) return;

        // ✅ Chỉ join nếu đã authenticated, nếu chưa thì lưu vào pending
        if (isAuthenticatedRef.current) {
            socket.emit("join_room", { topic, examId });
            //console.log("🔵 Joined room:", topic);
        } else {
            pendingJoinRef.current = { topic, examId };
        }
    }, []);

    const leaveRoom = useCallback((topic: string) => {
        const socket = socketRef.current;
        if (!socket) return;

        socket.emit("leave_room", { topic });
        //console.log("🔴 LEAVE:", topic);
    }, []);


    // expose socket instance và các method tiện ích
    return {
        socket: socketRef.current,
        onlineUsers,
        // Method để emit các event
        emit: (event: string, data?: any) => {
            if (socketRef.current) {
                socketRef.current.emit(event, data);
                //console.log(`🔔 Emitting ${event}:`, data);
            }
        },
        // Một số method tiện ích phổ biến (optional)
        joinRoom,
        leaveRoom
    };
};

