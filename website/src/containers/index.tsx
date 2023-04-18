import { ReactNode } from "react";
import BotProvider from "./Bot";
import ComponentsRefProvider from "./ComponentsRef";
import SocketProvider from "./Socket";

interface ContainersProps {
    children: ReactNode;
}

export default function ContextProviders({ children }: ContainersProps) {
    return (
        <ComponentsRefProvider>
            <SocketProvider>
                <BotProvider>{children}</BotProvider>
            </SocketProvider>
        </ComponentsRefProvider>
    );
}
