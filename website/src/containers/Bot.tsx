import { BotContext } from "@/contexts";
import { ContainerProps } from "@/interfaces";
import axios from "axios";
import { Loading } from "notiflix";
import { useEffect, useMemo, useState } from "react";

export default function BotProvider({ children }: ContainerProps) {
    const [username, setUsername] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [isFetching, setFetching] = useState(true);

    useEffect(() => {
        if (isFetching) {
            Loading.init({
                className: "notiflix-loading",
                zindex: 4000,
                backgroundColor: "rgba(0,0,0,0.8)",
                rtl: false,
                fontFamily: "Quicksand",
                cssAnimation: true,
                cssAnimationDuration: 400,
                clickToClose: false,
                customSvgUrl: null,
                customSvgCode: null,
                svgSize: "80px",
                svgColor: "#32c682",
                messageID: "NotiflixLoadingMessage",
                messageFontSize: "15px",
                messageMaxLength: 34,
                messageColor: "#dcdcdc",
            });

            Loading.pulse("Conectando...");
        }
    }, [isFetching]);

    useEffect(() => {
        if (!username) {
            setTimeout(() => {
                setFetching(true);
                axios
                    .get("http://localhost:3333/fecth-bot")
                    .then((res) => {
                        const { bot_username, user_id } = res.data;
                        setUsername(bot_username);
                        setId(user_id);
                    })
                    .catch((err) => console.log(err))
                    .finally(() => {
                        Loading.remove();
                        setFetching(false);
                    });
            }, 5000);
        }
    }, [isFetching]);

    const value = useMemo(() => ({ username, id }), [username, id]);

    return <BotContext.Provider value={value}>{children}</BotContext.Provider>;
}
