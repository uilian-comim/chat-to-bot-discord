import { IMessages, IRoom, ISendMessage } from "@/interfaces";
import { createContext, useContext } from "react";

interface ISocketContext {
    SendMessage: (props: ISendMessage) => void;
    setCurrentRoom: (props: IRoom) => void;
    setRooms: (props: Array<IRoom>) => void;
    messages: Array<IMessages> | null;
    message: string | null;
    date: string | null;
    currentUsername: string | null;
    currentRoom: IRoom | null;
    rooms: Array<IRoom>;
}

export const SocketContext = createContext<ISocketContext>({
    SendMessage: (props: ISendMessage) => {},
    setRooms: (props: Array<IRoom>) => {},
    setCurrentRoom: (props: IRoom) => {},
    messages: null,
    message: null,
    date: null,
    currentUsername: null,
    currentRoom: null,
    rooms: [],
});

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) throw new Error("Error SocketContext");
    return context;
}
