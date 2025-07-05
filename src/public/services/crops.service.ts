import { useAuthStore } from "@/auth/stores/useAuthStore.ts";
import axios from "axios";
import { Crop } from "@/public/models/Crop.ts";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT
});

export const getCrops = async (companyId: string): Promise<{ status: string; data: Crop[] | string; message?: string;}> => {
    const { token } = useAuthStore.getState(); 

    try {
        const response = await instance.get<Crop[]>(`/crops/company/${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {
            status: "success",
            data: response.data,
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                status: "error",
                data: "There was a problem with the server. Please try again in a few minutes.",
                message: error.message
            };
        }
        return {
            status: "error",
            data: "An unexpected error occurred."
        };
    }
}

export const deleteRecordById = async (cropId: string): Promise<{ status: string }> => {
    const { token } = useAuthStore.getState();
    try {
      await instance.delete(`/crops/${cropId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { status: "success" };
    } catch (error) {
      return { status: "error" };
    }
  };

export const updateCropById = async (cropId: string, updatedData: Partial<Crop>): Promise<{ status: string; data?: Crop; message?: string }> => {
    const { token } = useAuthStore.getState();
    try {
        const response = await instance.put<Crop>(`/crops/${cropId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {
            status: "success",
            data: response.data
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                status: "error",
                message: error.message
            };
        }
        return {
            status: "error",
            message: "An unexpected error occurred."
        };
    }
};