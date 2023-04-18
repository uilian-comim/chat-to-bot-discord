import { useSocket } from "@/contexts";
import { deleteRoom, disableRoom, enableRoom, fetchRooms } from "@/services";
import { Notify } from "notiflix";

interface IRoomButtonsProps {
    status: boolean;
    roomId: string;
}

export default function RoomButtons() {
    const { setRooms, setCurrentRoom, currentRoom } = useSocket();

    if (!currentRoom) return <h1>ERROR</h1>;

    return (
        <div className="btn-container">
            <button
                className="btn-error"
                onClick={async () => {
                    const response = await deleteRoom(currentRoom.id);
                    if (response.status === 200) {
                        Notify.success(response.data.success);
                        const res = await fetchRooms();

                        if (res.status === 200) {
                            const { allRooms } = res.data;
                            setRooms(allRooms);
                            if (allRooms.length > 0) {
                                setCurrentRoom(allRooms[0]);
                            }
                        } else {
                            Notify.failure(res.data.error);
                        }
                    } else {
                        Notify.failure(response.data.error);
                    }
                }}
            >
                Deletar
            </button>
            <button
                className={currentRoom.status ? "btn-warning" : "btn-warning btn--disable"}
                onClick={async () => {
                    const response = await disableRoom(currentRoom.id);
                    if (response.status === 200) {
                        Notify.success(response.data.success);

                        const res = await fetchRooms();

                        if (res.status === 200) {
                            const { allRooms } = res.data;
                            setRooms(allRooms);
                            if (allRooms.length > 0) {
                                allRooms.map((room) => {
                                    if (room.id === currentRoom.id) {
                                        setCurrentRoom(room);
                                    }
                                });
                            }
                        } else {
                            Notify.failure(res.data.error);
                        }
                    } else {
                        Notify.failure(response.data.error);
                    }
                }}
            >
                Desabilitar
            </button>
            <button
                className={!currentRoom.status ? "btn-success" : "btn-success btn--disable"}
                onClick={async () => {
                    const response = await enableRoom(currentRoom.id);
                    if (response.status === 200) {
                        Notify.success(response.data.success);

                        const res = await fetchRooms();

                        if (res.status === 200) {
                            const { allRooms } = res.data;
                            setRooms(allRooms);
                            if (allRooms.length > 0) {
                                allRooms.map((room) => {
                                    if (room.id === currentRoom.id) {
                                        setCurrentRoom(room);
                                    }
                                });
                            }
                        } else {
                            Notify.failure(res.data.error);
                        }
                    } else {
                        Notify.failure(response.data.error);
                    }
                }}
            >
                Habilitar
            </button>
        </div>
    );
}
