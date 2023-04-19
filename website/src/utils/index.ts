import { IMessage } from "@/interfaces";
import { format } from "date-fns";
import { MutableRefObject } from "react";

interface IUpdateDOM {
    localhost: boolean;
    messagesComponent: MutableRefObject<HTMLDivElement | null>;
    input: MutableRefObject<HTMLInputElement | null>;
    message: IMessage | null;
    username?: string | null;
}

function updateDOM({ input, localhost, message, messagesComponent, username }: IUpdateDOM) {
    if (localhost) {
        if (!messagesComponent.current || !input.current || !username) return;
        const MessageContainer = document.createElement("div");
        const UserElement = document.createElement("p");
        const MessageElement = document.createElement("p");
        const DateElement = document.createElement("span");

        UserElement.textContent = username;
        MessageElement.textContent = input.current.value;
        DateElement.textContent = format(new Date(), "dd/MM/yyyy HH:mm:ss");

        MessageContainer.setAttribute("class", "message-container");
        UserElement.setAttribute("class", "username");
        MessageElement.setAttribute("class", "message");

        MessageContainer.appendChild(UserElement);
        MessageContainer.appendChild(MessageElement);
        MessageContainer.appendChild(DateElement);

        messagesComponent.current.appendChild(MessageContainer);
        messagesComponent.current.scrollTo(0, document.body.scrollHeight);
        input.current.value = "";
    } else {
        if (!messagesComponent.current || !message) return;

        const MessageContainer = document.createElement("div");
        const UserElement = document.createElement("p");
        const MessageElement = document.createElement("p");
        const DateElement = document.createElement("span");
        UserElement.textContent = message.author_name;
        MessageElement.textContent = message.content;
        DateElement.textContent = message.created_at;

        MessageContainer.setAttribute("class", "message-container right");
        UserElement.setAttribute("class", "username");
        MessageElement.setAttribute("class", "message");

        MessageContainer.appendChild(UserElement);
        MessageContainer.appendChild(MessageElement);
        MessageContainer.appendChild(DateElement);

        messagesComponent.current.appendChild(MessageContainer);
        messagesComponent.current.scrollTo(0, document.body.scrollHeight);
    }
}
export { updateDOM };
