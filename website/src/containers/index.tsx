import { ReactNode } from "react";
import BotProvider from "./Bot";
import SocketProvider from "./Socket";

interface ContainersProps {
    children: ReactNode;
}

export default function ContextProviders({ children }: ContainersProps) {
    return (
        <SocketProvider>
            <BotProvider>{children}</BotProvider>
        </SocketProvider>
    );
}
