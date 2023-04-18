interface ISendMessage {
    username: string;
    message: string;
}

interface IRoom {
    id: string;
    username: string;
    status: boolean;
    discriminator: string;
}

interface IMessage {
    content: string;
    created_at: number;
    author_id: string;
    author_name: string;
}

export type { IMessage, IRoom, ISendMessage };
