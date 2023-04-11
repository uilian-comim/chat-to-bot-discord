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

interface IMessages {
    authorId: string;
    content: string;
    createdTimestamp: number;
}

export type { IMessages, IRoom, ISendMessage };
