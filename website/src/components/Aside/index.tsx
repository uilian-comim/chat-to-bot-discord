import { useSocket } from "@/contexts";
import { v4 as uuidv4 } from "uuid";
import { AddButton, RefreshButton } from "../Button";

export default function Aside() {
    const { setCurrentRoom, setRooms, rooms, currentRoom } = useSocket();

    return (
        <aside>
            <AddButton />
            <RefreshButton />
            {rooms.map((room) => (
                <button
                    key={uuidv4()}
                    type="button"
                    className={currentRoom && currentRoom.id === room.id ? "btn-active" : "btn"}
                    onClick={() => {
                        setCurrentRoom(room);
                    }}
                >
                    {room.username}#{room.discriminator}
                </button>
            ))}
        </aside>
    );
}
