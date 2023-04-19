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
            <BotProvider>
                <SocketProvider>{children}</SocketProvider>
            </BotProvider>
        </ComponentsRefProvider>
    );
}
