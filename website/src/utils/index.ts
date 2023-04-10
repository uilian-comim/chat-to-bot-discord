import { format } from "date-fns";
import { MutableRefObject } from "react";

interface IUpdateDOM {
    localhost: boolean;
    inputValue: string | undefined;
    messagesComponent: MutableRefObject<HTMLDivElement | null>;
    input: MutableRefObject<HTMLInputElement | null>;
    message: string | null;
    date: string | null;
    username: string | null;
    currentUsername: string | null;
}

function updateDOM({
    username,
    currentUsername,
    input,
    inputValue,
    localhost,
    message,
    messagesComponent,
    date,
}: IUpdateDOM) {
    if (localhost) {
        if (!inputValue || !messagesComponent.current || !input.current) return;
        const userElement = document.createElement("div");
        const messageElement = document.createElement("div");
        const contentElement = document.createElement("div");
        const dateElement = document.createElement("span");

        userElement.textContent = username;
        contentElement.textContent = inputValue;
        dateElement.textContent = format(new Date(), "dd/MM/yyyy HH:mm:ss");

        userElement.setAttribute("class", "user");
        contentElement.setAttribute("class", "content");
        messageElement.setAttribute("class", "message");

        messageElement.appendChild(userElement);
        messageElement.appendChild(contentElement);
        messageElement.appendChild(dateElement);

        messagesComponent.current.appendChild(messageElement);
        messagesComponent.current.scrollTo(0, document.body.scrollHeight);
        input.current.value = "";
    } else {
        if (!messagesComponent.current || !input.current || !message || !date) return;

        const userElement = document.createElement("div");
        const messageElement = document.createElement("div");
        const contentElement = document.createElement("div");
        const dateElement = document.createElement("span");
        userElement.textContent = currentUsername;
        contentElement.textContent = message;
        dateElement.textContent = date;

        userElement.setAttribute("class", "user");
        contentElement.setAttribute("class", "content");
        messageElement.setAttribute("class", "message right");

        messageElement.appendChild(userElement);
        messageElement.appendChild(contentElement);
        messageElement.appendChild(dateElement);

        messagesComponent.current.appendChild(messageElement);
        messagesComponent.current.scrollTo(0, document.body.scrollHeight);
        input.current.value = "";
    }
}
export { updateDOM };
