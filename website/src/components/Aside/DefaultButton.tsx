import { ButtonHTMLAttributes, ReactElement } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactElement;
    text: string;
}

export default function DefaultButton({ text, icon, ...rest }: ButtonProps) {
    return (
        <button type="button" className="btn" {...rest}>
            {icon && <span>{icon}</span>}
            {text}
        </button>
    );
}
