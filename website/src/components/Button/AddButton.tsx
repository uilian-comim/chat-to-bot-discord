import { useSocket } from "@/contexts";
import { createRoom, fetchRooms } from "@/services";
import { Confirm, Notify } from "notiflix";

export default function AddButton() {
    const { setCurrentRoom, setRooms, rooms } = useSocket();

    return (
        <button
            type="button"
            className="btn-primary"
            onClick={() => {
                Confirm.prompt(
                    "Criar novo canal",
                    "Digite o id do usuário com quem deseja criar um novo canal privado.",
                    "",
                    "Confirmar",
                    "Cancelar",
                    async (prop) => {
                        const response = await createRoom(prop);
                        if (response.status === 200) {
                            Notify.success(response.data.success);
                            const res = await fetchRooms();
                            const { fullRooms } = res.data;
                            setRooms(fullRooms);
                            if (rooms.length > 0) {
                                setCurrentRoom(rooms[0]);
                            }
                        } else {
                            Notify.failure(response.data.error);
                        }
                    }
                );
            }}
        >
            Criar novo canal
        </button>
    );
}
