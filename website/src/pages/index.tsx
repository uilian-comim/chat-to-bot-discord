import Aside from "@/components/Aside";
import RoomButtons from "@/components/Room";
import { useBot, useComponentsRef, useSocket } from "@/contexts";
import { IRoom } from "@/interfaces";
import { fetchRooms } from "@/services";
import { updateDOM } from "@/utils";
import { format } from "date-fns";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Notify } from "notiflix";
import { FormEvent, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface HomeProps {
    allRooms: Array<IRoom>;
}

export default function Home({ allRooms }: HomeProps) {
    const { ElementInput, ElementMessages } = useComponentsRef();
    const { setRooms, SendMessage, messages, rooms, message, currentRoom } = useSocket();
    const { username, id } = useBot();

    useEffect(() => {
        setRooms(allRooms);
    }, []);

    useEffect(() => {
        Notify.init({
            clickToClose: true,
        });
    }, []);

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!username) {
            return;
        }

        if (!ElementInput.current || (ElementInput.current && !ElementInput.current.value)) return;

        const msg = ElementInput.current.value;
        updateDOM({ localhost: true, input: ElementInput, message, messagesComponent: ElementMessages, username });
        SendMessage({ message: msg, username: username });
    }

    return (
        <div className="home">
            <Head>
                <title>Chat</title>
            </Head>
            <Aside />
            {currentRoom ? (
                <div className="home-content">
                    <RoomButtons />
                    <div className="messages" ref={ElementMessages}>
                        {messages &&
                            messages.map((msg) => {
                                if (msg.author_id === id) {
                                    return (
                                        <div className="message-container" key={uuidv4()}>
                                            <div className="username">{msg.author_name}</div>
                                            <div className="message">{msg.content}</div>
                                            <span>{format(msg.created_at, "dd/MM/yyyy HH:mm:ss")}</span>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="message-container right" key={uuidv4()}>
                                            <div className="username">{msg.author_name}</div>
                                            <div className="message">{msg.content}</div>
                                            <span>{format(msg.created_at, "dd/MM/yyyy HH:mm:ss")}</span>
                                        </div>
                                    );
                                }
                            })}
                    </div>
                    <form className="footer" onSubmit={(e) => onSubmit(e)}>
                        <input
                            placeholder="Digite a mensagem que deseja enviar"
                            name="message"
                            type="text"
                            ref={ElementInput}
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

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
    const response = await fetchRooms();

    const { allRooms } = response.data;
    return {
        props: { allRooms },
    };
};
