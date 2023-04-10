import { IGetResponse, IRoom } from "@/interfaces";
import axios, { AxiosResponse } from "axios";

interface IFetchRooms extends IGetResponse {
    fullRooms: Array<IRoom>;
}

export async function fetchRooms(): Promise<AxiosResponse<IFetchRooms>> {
    try {
        const response = await axios.get("http://localhost:3333/fetch-rooms");

        return response;
    } catch (err: any) {
        return err.response;
    }
}

export async function createRoom(user_id: string): Promise<AxiosResponse<IGetResponse>> {
    try {
        const response = await axios.post("http://localhost:3333/create-room", {
            user_id,
        });

        return response;
    } catch (err: any) {
        return err.response;
    }
}

export async function disableRoom(room_id: string): Promise<AxiosResponse<IGetResponse>> {
    try {
        const response = await axios.put("http://localhost:3333/disable-room", {
            room_id,
        });

        return response;
    } catch (err: any) {
        return err.response;
    }
}

export async function enableRoom(room_id: string): Promise<AxiosResponse<IGetResponse>> {
    try {
        const response = await axios.put("http://localhost:3333/enable-room", {
            room_id,
        });

        return response;
    } catch (err: any) {
        return err.response;
    }
}

export async function deleteRoom(room_id: string): Promise<AxiosResponse<IGetResponse>> {
    try {
        const response = await axios.delete("http://localhost:3333/delete-room", {
            data: {
                room_id,
            },
        });

        return response;
    } catch (err: any) {
        return err.response;
    }
}
