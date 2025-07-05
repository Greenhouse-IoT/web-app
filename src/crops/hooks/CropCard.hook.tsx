import { useState } from "react";
import { deleteRecordById } from "@/public/services/crops.service";
import { updateCropById } from "@/public/services/crops.service";

interface UseDeleteCropReturn {
  handleDeleteCrop: (cropId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface UseEditCropReturn {
  handleEditCrop: (cropId: string, updatedData: any) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useDeleteCrop = (): UseDeleteCropReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDeleteCrop = async (cropId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await deleteRecordById(cropId);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error eliminando el cultivo.");
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteCrop, loading, error, success };
};

export const useEditCrop = (): UseEditCropReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleEditCrop = async (cropId: string, updatedData: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateCropById(cropId, updatedData);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error editando el cultivo.");
    } finally {
      setLoading(false);
    }
  };

  return { handleEditCrop, loading, error, success };
}
