import { useSocket } from "@/contexts";
import { fetchRooms } from "@/services";
import { Loading, Notify } from "notiflix";

export default function RefreshButton() {
    const { setRooms } = useSocket();

    return (
        <button
            type="button"
            className="btn-primary margin"
            onClick={async () => {
                Loading.circle("Atualizando...");
                const response = await fetchRooms().finally(() => Loading.remove());
                if (response.status === 200) {
                    Notify.success(response.data.success);
                    const { allRooms } = response.data;
                    setRooms(allRooms);
                } else {
                    Notify.failure(response.data.error);
                }
            }}
        >
            Atualizar
        </button>
    );
}
