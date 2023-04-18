import { useSocket } from "@/contexts";
import { createRoom, fetchRooms } from "@/services";
import { Confirm, Notify } from "notiflix";

export default function AddButton() {
    const { setRooms } = useSocket();

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
                            const { allRooms } = res.data;
                            setRooms(allRooms);
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
