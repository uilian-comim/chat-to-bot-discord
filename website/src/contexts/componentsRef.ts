import { MutableRefObject, createContext, createRef, useContext } from "react";

interface IComponentsRef {
    ElementInput: MutableRefObject<HTMLInputElement | null>;
    ElementMessages: MutableRefObject<HTMLDivElement | null>;
}

export const ComponentsRefContext = createContext<IComponentsRef>({
    ElementInput: createRef<HTMLInputElement>(),
    ElementMessages: createRef<HTMLDivElement>(),
});

export function useComponentsRef() {
    const context = useContext(ComponentsRefContext);
    if (!context) throw new Error("Error ComponentsContext");
    return context;
}
