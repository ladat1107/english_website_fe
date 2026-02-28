import envConfig from "@/utils/env-config";
import { io, Socket } from "socket.io-client";

type InitSocketOptions = {
    namespace: string;
};

export const initSocket = ({ namespace }: InitSocketOptions): Socket => {
    return io(`${envConfig.NEXT_PUBLIC_SOCKET_URL}/${namespace}`, {
        autoConnect: true,
        transports: ["websocket"],
        withCredentials: true,
    });
};
