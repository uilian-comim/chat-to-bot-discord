import { httpServer } from "api";
import { format } from "date-fns";
import prisma from "db";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { SocketServer } from "socket";

const socketServer = new SocketServer(httpServer);

export const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
});

async function loadDMChannels() {
    const users = await prisma.dMChannels.findMany({
        where: {
            status: true,
        },
    });

    users.map(async (user) => {
        const finded = await client.users.fetch(user.user_id);
        if (!finded) console.log("ERRO GRAVE NA APLICAÇÃO!!");

        await finded.createDM();
    });
    httpServer.listen(3333);
}

client.once(Events.ClientReady, async (c) => {
    await loadDMChannels();
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("messageCreate", (message) => {
    try {
        if (message.author.bot) return;

        prisma.dMChannels
            .findFirst({
                where: {
                    user_id: message.author.id,
                },
            })
            .then((user) => {
                if (!user) {
                    return;
                } else {
                    socketServer.io.to(user.id).emit("message", {
                        message: message.content,
                        username: user.username,
                        created_at: format(message.createdAt, "dd/MM/yyyy HH:mm:ss"),
                    });
                }
            });
    } catch (err) {
        console.log(err);
    }
});

async function Start() {
    const bot = await prisma.bot.findFirst();

    if (!bot) {
        console.log("Não foi encontrado um token para a inicialização do bot.");
    } else {
        client.login(bot.token);
    }
}

Start();
