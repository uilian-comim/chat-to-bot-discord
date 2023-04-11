import { createContext, useContext } from "react";

interface IBotContext {
    username: string | null;
    id: string | null;
}

export const BotContext = createContext<IBotContext>({
    username: null,
    id: null,
});

export function useBot() {
    const context = useContext(BotContext);
    if (!context) throw new Error("Error BotContext");
    return context;
}
