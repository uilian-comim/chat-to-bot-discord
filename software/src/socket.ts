import { format } from "date-fns";
import prisma from "db";
import { client } from "index";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export class SocketServer {
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

    constructor(httpServer: any) {
        this.io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
            },
        });

        this.io.on("connection", (socket: Socket) => {
            console.log(`Usuário conectado com sucesso.\nSocket id: ${socket.id}`);

            socket.on("change-room", (room_name) => {
                console.log(`O usuário ${socket.id} entrou na sala ${room_name}`);
                prisma.dMChannels
                    .findFirst({
                        where: {
                            id: room_name,
                        },
                    })
                    .then(async (res) => {
                        if (res) {
                            const user = await client.users.fetch(res.user_id);
                            if (user) {
                                if (user.dmChannel) {
                                    const messages = await user.dmChannel.messages.fetch({
                                        limit: 15,
                                    });

                                    const reverseMessages = [...messages].reverse();

                                    socket.emit("load messages", {
                                        messages: messages.reverse(),
                                    });
                                }
                            }
                        }
                    });
                socket.join(room_name);
            });

            // socket.on("join-room", (room_name) => {
            //     socket.join(room_name);
            //     console.log(`O usuário ${socket.id} se conectou com sucesso a sala ${room_name}`);
            // });

            socket.on("message", (props) => {
                prisma.dMChannels
                    .findFirst({
                        where: {
                            id: props.room,
                        },
                    })
                    .then(async (res) => {
                        if (!res) {
                            socket.to(props.room).emit("message", {
                                message: "Usuário não encontrado no banco de dados.",
                                username: "SISTEMA",
                                created_at: format(new Date(), "dd/MM/yyyy HH:mm:ss"),
                            });
                        } else {
                            const user = await client.users.fetch(res.user_id);
                            if (!user) {
                                socket.to(props.room).emit("message", {
                                    message:
                                        "Usuário não encontrado no cache do bot.\nVerifique se o usuário está no mesmo servidor do bot.",
                                    username: "SISTEMA",
                                    created_at: format(new Date(), "dd/MM/yyyy HH:mm:ss"),
                                });
                            } else {
                                user.send(props.message);
                            }
                        }
                    });
            });

            socket.on("disconnect", (props) => {
                console.log(props);
            });
        });
    }
}
