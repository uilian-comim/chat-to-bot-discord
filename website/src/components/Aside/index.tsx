import { useSocket } from "@/contexts";
import { v4 as uuidv4 } from "uuid";
import AddButton from "./AddButton";
import RefreshButton from "./RefreshButton";

export default function Aside() {
    const { setOldRoom, setCurrentRoom, rooms, currentRoom } = useSocket();

    return (
        <aside>
            <AddButton />
            <RefreshButton />
            {rooms.length > 0 &&
                rooms.map((room) => (
                    <button
                        key={uuidv4()}
                        type="button"
                        className={currentRoom && currentRoom.id === room.id ? "btn-active" : "btn"}
                        onClick={() => {
                            if (currentRoom) {
                                setOldRoom(currentRoom);
                            }
                            setCurrentRoom(room);
                        }}
                    >
                        {room.username}#{room.discriminator}
                    </button>
                ))}
        </aside>
    );
}
