import Aside from "@/components/Aside";
import { useBot, useSocket } from "@/contexts";
import { deleteRoom, disableRoom, enableRoom, fetchRooms } from "@/services";
import { updateDOM } from "@/utils";
import Head from "next/head";
import { Confirm, Notify } from "notiflix";
import { FormEvent, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
    const [inputValue, setInputValue] = useState<string>();
    const messagesComponent = useRef<HTMLDivElement | null>(null);
    const input = useRef<HTMLInputElement | null>(null);
    const { rooms, setCurrentRoom, setRooms, SendMessage, message, date, currentUsername, currentRoom } = useSocket();
    const { username } = useBot();

    useEffect(() => {
        updateDOM({ currentUsername, date, input, inputValue, localhost: false, message, messagesComponent, username });
    }, [message, date, currentUsername]);

    useEffect(() => {
        if (messagesComponent.current) {
            messagesComponent.current.innerHTML = "";
        }
    }, [currentRoom]);

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!username) {
            return;
        }

        if (!inputValue) return;

        updateDOM({ localhost: true, currentUsername, date, input, inputValue, message, messagesComponent, username });
        SendMessage({ message: inputValue, username: username });
    }

    useEffect(() => {
        Notify.init({
            clickToClose: true,
        });
    }, []);

    return (
        <div className="home">
            <Head>
                <title>Chat</title>
            </Head>
            <Aside />
            {currentRoom ? (
                <div className="home-content">
                    {rooms.map((room) => (
                        <div
                            key={uuidv4()}
                            className={
                                currentRoom && currentRoom.id === room.id ? "btn-container" : "btn-container--hidden"
                            }
                        >
                            <button
                                type="button"
                                className="btn-warning"
                                onClick={async () => {
                                    Confirm.show(
                                        `Deletar`,
                                        `Deseja mesmo deletar o canal aberto com o usuário:${room.username}#${room.discriminator}`,
                                        "Confirmar",
                                        "Cancelar",
                                        async () => {
                                            const response = await deleteRoom(room.id);
                                            if (response.status === 200) {
                                                const newData = await fetchRooms();
                                                const { fullRooms } = newData.data;
                                                setRooms(fullRooms);
                                                fullRooms.map((room) => {
                                                    if (room.id === currentRoom?.id) {
                                                        setCurrentRoom(room);
                                                    }
                                                });
                                                Notify.success(response.data.success);
                                            } else {
                                                Notify.failure(response.data.error);
                                            }
                                        }
                                    );
                                }}
                            >
                                Deletar
                            </button>
                            <button
                                type="button"
                                className={room.status ? "btn-error" : "btn-error btn--disable"}
                                onClick={async () => {
                                    if (room.status === true) {
                                        const response = await disableRoom(room.id);
                                        if (response.status === 200) {
                                            const newData = await fetchRooms();
                                            const { fullRooms } = newData.data;
                                            setRooms(fullRooms);
                                            rooms.map((room) => {
                                                if (room.id === currentRoom?.id) {
                                                    setCurrentRoom(room);
                                                }
                                            });
                                            Notify.success(response.data.success);
                                        } else {
                                            Notify.failure(response.data.error);
                                        }
                                    }
                                }}
                            >
                                Desabilitar
                            </button>
                            <button
                                type="button"
                                className={!room.status ? "btn-success" : "btn-success btn--disable"}
                                onClick={async () => {
                                    if (room.status === false) {
                                        const response = await enableRoom(room.id);
                                        if (response.status === 200) {
                                            const newData = await fetchRooms();
                                            const { fullRooms } = newData.data;
                                            setRooms(fullRooms);
                                            rooms.map((room) => {
                                                if (room.id === currentRoom?.id) {
                                                    setCurrentRoom(room);
                                                }
                                            });
                                            Notify.success(response.data.success);
                                        } else {
                                            Notify.failure(response.data.error);
                                        }
                                    }
                                }}
                            >
                                Habilitar
                            </button>
                        </div>
                    ))}
                    <div className="messages" ref={messagesComponent}></div>
                    <form className="footer" onSubmit={(e) => onSubmit(e)}>
                        <input
                            placeholder="Digite a mensagem que deseja enviar"
                            name="message"
                            type="text"
                            onChange={(e) => setInputValue(e.target.value)}
                            ref={input}
                        />
                        <button className="btn-active" type="submit">
                            Enviar
                        </button>
                    </form>
                </div>
            ) : (
                <div className="home-container">
                    <h1>{username}</h1>
                    {rooms.length > 0 ? (
                        <p>Escolha um canal para começar a enviar mensagens.</p>
                    ) : (
                        <p>Crie um novo canal privado com alguém e comece a enviar mensagens.</p>
                    )}
                </div>
            )}
        </div>
    );
}
