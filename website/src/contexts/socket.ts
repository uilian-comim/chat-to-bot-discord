import { IMessage, IRoom, ISendMessage } from "@/interfaces";
import { createContext, useContext } from "react";

interface ISocketContext {
    SendMessage: (props: ISendMessage) => void;
    setCurrentRoom: (props: IRoom) => void;
    setOldRoom: (props: IRoom) => void;
    setRooms: (props: Array<IRoom>) => void;
    setMessages: (props: Array<IMessage>) => void;
    messages: Array<IMessage>;
    message: IMessage | null;
    currentRoom: IRoom | null;
    rooms: Array<IRoom>;
}

export const SocketContext = createContext<ISocketContext>({
    SendMessage: (props: ISendMessage) => {},
    setCurrentRoom: (props: IRoom) => {},
    setOldRoom: (props: IRoom) => {},
    setRooms: (props: Array<IRoom>) => {},
    setMessages: (props: Array<IMessage>) => {},
    messages: [],
    message: null,
    currentRoom: null,
    rooms: [],
});

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) throw new Error("Error SocketContext");
    return context;
}
