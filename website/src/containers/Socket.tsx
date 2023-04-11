import { SocketContext } from "@/contexts";
import { ContainerProps, IMessages, IRoom, ISendMessage } from "@/interfaces";
import { fetchRooms } from "@/services";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3333");

export default function SocketProvider({ children }: ContainerProps) {
    const [message, setMessage] = useState<string | null>(null);
    const [date, setDate] = useState<string | null>(null);
    const [currentUsername, setUsername] = useState<string | null>(null);
    const [rooms, SetRooms] = useState<Array<IRoom>>([]);
    const [currentRoom, setRoom] = useState<IRoom | null>(null);
    const [messages, setMessages] = useState<Array<IMessages> | null>(null);

    useEffect(() => {
        fetchRooms().then((response) => {
            if (response.status === 200) {
                const { fullRooms } = response.data;
                setRooms(fullRooms);
                if (rooms.length > 0) {
                    setCurrentRoom(rooms[0]);
                }
            }
        });
    }, []);

    useEffect(() => {
        if (currentRoom) {
            socket.emit("change-room", currentRoom.id);
        }
    }, [currentRoom]);

    // socket.on("connect", () => {});

    socket.on("load messages", (props) => {
        const { messages, user } = props;
        setMessages(messages);
    });

    socket.on("message", (props) => {
        setMessage(props.message);
        setDate(props.created_at);
    });

    // socket.on("disconnect", (props) => {});

    function SendMessage(props: ISendMessage) {
        if (currentRoom) {
            socket.emit("message", { ...props, room: currentRoom.id });
        }
    }

    function setCurrentRoom(props: IRoom) {
        setMessages(null);
        setUsername(props.username);
        setRoom(props);
    }

    function setRooms(props: Array<IRoom>) {
        SetRooms(props);
    }

    const value = useMemo(
        () => ({ SendMessage, setCurrentRoom, setRooms, message, messages, date, currentUsername, rooms, currentRoom }),
        [message, date, currentUsername, rooms, currentRoom, messages]
    );

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
