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

export type { IRoom, ISendMessage };
