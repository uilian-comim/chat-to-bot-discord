import cors from "cors";
import prisma from "db";
import express from "express";
import { createServer } from "http";
import { client } from "index";

const server = express();
server.use(cors());
server.use(express.json());
export const httpServer = createServer(server);

server.get("/fecth-bot", (req, res) => {
    if (!client.user) {
        return res.status(404).json("Usuário não encontrado.");
    }

    const username = client.user.username;
    res.status(200).json({ bot_username: username });
});

server.get("/fetch-rooms", async (req, res) => {
    try {
        const dmChannels = await prisma.dMChannels.findMany({
            select: {
                id: true,
                username: true,
                status: true,
                discriminator: true,
            },
        });

        res.status(200).json({ fullRooms: dmChannels });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
});

server.post("/create-room", async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) return res.status(400).json({ error: "ID do usuário não informado!" });

        const user = await client.users.fetch(user_id).catch((err) => {
            if (err.status === 404) {
                throw new Error("Usuário não encontrado. Verifique o id e tente novamente.");
            } else {
                console.log(err);
            }
        });
        if (!user) throw new Error("Erro desconhecido ao buscar usuário.");
        await user.createDM();

        await prisma.dMChannels.create({
            data: {
                user_id,
                username: user.username,
                status: true,
                discriminator: user.discriminator,
            },
        });

        return res.status(200).json({ success: `Canal privado com o usuário ${user.tag} criado com sucesso.` });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "ID incorreto ou usuário não está no mesmo servidor que o bot.\nSe tudo estiver correto e ainda assim ocorreu um erro, contate um administrador.",
        });
    } finally {
        await prisma.$disconnect();
    }
});

server.delete("/delete-room", async (req, res) => {
    try {
        const { room_id } = req.body;
        const response = await prisma.dMChannels.findFirst({
            where: {
                id: room_id,
            },
        });

        if (!response) return res.status(404).json({ error: "Canal não encontrado." });

        const user = await client.users.fetch(response.user_id);
        user.deleteDM();

        await prisma.dMChannels.delete({
            where: {
                id: room_id,
            },
        });
        return res.status(200).json({ success: "Canal deletado com sucesso." });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "Erro desconhecido.",
        });
    } finally {
        await prisma.$disconnect();
    }
});

server.put("/disable-room", async (req, res) => {
    try {
        const { room_id } = req.body;

        if (!room_id) return res.status(400).json({ error: "ID do canal não informado." });

        const finded = await prisma.dMChannels.findFirst({
            where: {
                id: room_id,
            },
        });

        if (!finded) return res.status(404).send("Canal não encontrado.");

        const user = await client.users.fetch(finded.user_id);

        await user.deleteDM();

        await prisma.dMChannels.update({
            data: {
                status: false,
            },
            where: {
                id: room_id,
            },
        });

        return res.status(200).json({ success: `Canal privado com o usuário ${user.tag} fechado com sucesso!` });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Erro desconhecido." });
    } finally {
        await prisma.$disconnect();
    }
});

server.put("/enable-room", async (req, res) => {
    try {
        const { room_id } = req.body;
        const finded = await prisma.dMChannels.findFirst({
            where: {
                id: room_id,
            },
        });

        if (!finded) return res.status(404).json({ error: "Canal não encontrado." });

        const user = await client.users.fetch(finded.user_id);

        await user.createDM();

        await prisma.dMChannels.update({
            data: {
                status: true,
            },
            where: {
                id: room_id,
            },
        });

        return res.status(200).json({ success: `Canal privado com o usuário ${user.tag} aberto com sucesso.` });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Erro desconhecido." });
    } finally {
        await prisma.$disconnect();
    }
});

server.post("/message", async (req, res) => {
    try {
        const { message, user_id } = req.body;

        if (!user_id) return res.send("ID do usuário não informado.");
        if (!message) return res.send("Nem uma mensagem recebida.");

        const response = await prisma.dMChannels.findFirst({
            where: {
                user_id,
            },
        });

        if (!response) return res.status(404).json({ error: "Usuário não encontrado no banco de dados." });

        if (!response.status) {
            return res.status(403).json({ error: "O canal privado com esse usuário está fechado." });
        }

        const user = await client.users.fetch(user_id);
        user.send(message);

        return res.status(200).json({ success: `Mensagem enviada com sucesso para o usuário ${user.tag}` });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Erro desconhecido." });
    } finally {
        await prisma.$disconnect();
    }
});
