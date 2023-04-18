import { SocketContext, useComponentsRef } from "@/contexts";
import { ContainerProps, IMessage, IRoom, ISendMessage } from "@/interfaces";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3333");

export default function SocketProvider({ children }: ContainerProps) {
    const { ElementMessages, ElementInput } = useComponentsRef();
    const [message, setMessage] = useState<IMessage | null>(null);
    const [rooms, setRooms] = useState<Array<IRoom>>([]);
    const [currentRoom, setRoom] = useState<IRoom | null>(null);
    const [oldRoom, setOldRoom] = useState<IRoom | null>(null);
    const [messages, setMessages] = useState<Array<IMessage>>([]);

    useEffect(() => {
        if (ElementMessages.current) {
            ElementMessages.current.scrollTo(0, document.body.scrollHeight);
        }
    }, [messages]);

    useEffect(() => {
        if (message) {
            const newMessages = [...messages];
            newMessages.push(message);
            setMessages(newMessages);
        }
    }, [message]);

    useEffect(() => {
        if (oldRoom) {
            socket.emit("leave-room", oldRoom.id);
        }

        if (ElementMessages.current && currentRoom) {
            socket.emit("change-room", currentRoom.id);
            ElementMessages.current.innerHTML = "";
        }
    }, [currentRoom]);

    socket.on("connect", () => {
        // Notify.info("Conexão com o servidor de chat efetuada com sucesso.");
    });

    socket.on("load-messages", (props) => {
        const { messages } = props;
        setMessages(messages);
    });

    socket.on("message", (props) => {
        const { message } = props;
        setMessage(message);
    });

    function SendMessage(props: ISendMessage) {
        if (currentRoom) {
            socket.emit("message", { ...props, room: currentRoom.id });
        }
    }

    function setCurrentRoom(props: IRoom) {
        setMessages([]);
        setMessage(null);
        setRoom(props);
    }

    const value = useMemo(
        () => ({
            SendMessage,
            setCurrentRoom,
            setRooms,
            setMessages,
            setOldRoom,
            message,
            messages,
            rooms,
            currentRoom,
        }),
        [rooms, currentRoom, messages, message]
    );

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
