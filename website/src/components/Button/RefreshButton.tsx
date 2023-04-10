import { useSocket } from "@/contexts";
import { fetchRooms } from "@/services";
import { Loading, Notify } from "notiflix";

export default function RefreshButton() {
    const { setCurrentRoom, setRooms, rooms, currentRoom } = useSocket();

    return (
        <button
            type="button"
            className="btn-primary margin"
            onClick={async () => {
                console.log(currentRoom);
                Loading.circle("Atualizando...");
                Loading.remove(2000);
                const response = await fetchRooms();
                if (response.status === 200) {
                    Notify.success(response.data.success);
                    const { fullRooms } = response.data;
                    setRooms(fullRooms);
                    if (rooms.length > 0) {
                        setCurrentRoom(rooms[0]);
                    }
                } else {
                    Notify.failure(response.data.error);
                }
            }}
        >
            Atualizar
        </button>
    );
}