import { ComponentsRefContext } from "@/contexts";
import { ContainerProps } from "@/interfaces";
import { useMemo, useRef } from "react";

export default function ComponentsRefProvider({ children }: ContainerProps) {
    const ElementMessages = useRef<HTMLDivElement | null>(null);
    const ElementInput = useRef<HTMLInputElement | null>(null);

    const value = useMemo(() => ({ ElementInput, ElementMessages }), [ElementInput, ElementMessages]);

    return <ComponentsRefContext.Provider value={value}>{children}</ComponentsRefContext.Provider>;
}
