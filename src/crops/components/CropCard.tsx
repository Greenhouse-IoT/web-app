import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "@/shared/components/DropDownComponent";
import { DeleteDialog } from "@/shared/components/DeleteDialog";
import { useDeleteCrop } from "../hooks/CropCard.hook";
import { useEditCrop } from "../hooks/CropCard.hook";
import {
  getRecordsByCropIdAndPhase,
  deleteRecordById,
} from "../services/records.service";
import { EditDialog } from "@/shared/components/EditDialog";

type CropCardProps = {
  cropId: string;
  cropName: string;
  startDate: string;
  phase: string;
};

export const CropCard = ({
  cropId,
  cropName,
  startDate,
  phase,
}: CropCardProps): ReactElement => {
  const navigate = useNavigate();
  const capitalize = (s: string | any[]) =>
    s && s[0].toUpperCase() + s.slice(1);
  const [dropdown, setDropdown] = useState(false);
  const [showDeleteDialog, setDeleteDialog] = useState(false);
  const [showEditDialog, setEditDialog] = useState(false);
  const { handleDeleteCrop, loading: deleteLoading, error: deleteError } = useDeleteCrop();
  const { handleEditCrop, loading: editLoading, error: editError } = useEditCrop();

  const handleDeleteDialog = () => {
    setDeleteDialog(!showDeleteDialog);
  };

    const handleEditDialog = () => {
    setEditDialog(!showEditDialog);
  };

  const options = ["Eliminar"];

  const handleItemClick = (option: string) => {
    if (option === "Eliminar") {
      handleDeleteDialog();
    }
    else if (option === "Editar") {
      handleEditDialog();
    }
  };

  const deleteAllRecords = async () => {
    const response = await getRecordsByCropIdAndPhase(cropId, phase);
    if (response.status === "success" && Array.isArray(response.data)) {
      for (const record of response.data) {
        await deleteRecordById(record.id);
      }
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteAllRecords();
      await handleDeleteCrop(cropId);
      setDeleteDialog(false);
      window.location.reload();
    } catch (err) {
      console.error("Error al eliminar el cultivo:", err);
    }
  };

  const confirmEdit = async (updatedData: any) => {
    try {
      await handleEditCrop(cropId, updatedData);
      setEditDialog(false);
      window.location.reload();
    } catch (err) {
      console.error("Error al editar el cultivo:", err);
    }
  };

  return (
    <div className="flex flex-col cursor-pointer bg-white border-2 rounded-lg overflow-hidden m-2 sm:m-4 hover:opacity-90 duration-300">
      <div className="w-full overflow-hidden pb-4">
        <img
          onClick={() => navigate(`/records/${cropId}/${phase}`)}
          className="object-cover w-full h-1/2 mb-4 "
          src="/mushroom_images/hongos2.webp"
          alt={cropName}
        />
        <div className="flex flex-col justify-center align-middle px-6 flex-grow space-y-4">
          <div className="flex justify-between items-center">
            <h4
              onClick={() => navigate(`/records/${cropId}/${phase}`)}
              className="overflow-hidden"
            >
              Crop Name: {cropName}
            </h4>
            <div>
              <button
                id="dropdownDefaultButton"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setDropdown(!dropdown);
                }}
                className="p-3"
              >
                <svg
                  width="5"
                  height="16"
                  viewBox="0 0 5 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="2.33301"
                    cy="2"
                    r="2"
                    transform="rotate(-90 2.33301 2)"
                    fill="#898989"
                  />
                  <circle
                    cx="2.33301"
                    cy="8"
                    r="2"
                    transform="rotate(-90 2.33301 8)"
                    fill="#898989"
                  />
                  <circle
                    cx="2.33301"
                    cy="14"
                    r="2"
                    transform="rotate(-90 2.33301 14)"
                    fill="#898989"
                  />
                </svg>
              </button>
              {dropdown && (
                <Dropdown options={options} onOptionSelect={handleItemClick} />
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="flex items-center gap-2">
              <img src="/icons/calendar.svg" alt="calendar" />
              <strong className="text-sm text-primary">
                Fecha de inicio:{" "}
              </strong>
              <h2 className="text-xs text-secondary">{startDate}</h2>
            </span>
            <span className="flex items-center gap-2">
              <img src="/icons/mushroom.svg" alt="mushroom" />
              <strong className="text-sm text-primary">Fase actual: </strong>
              <h2 className="text-xs text-secondary">{capitalize(phase)}</h2>
            </span>
          </div>
        </div>
      </div>
      {showDeleteDialog && (
        <DeleteDialog
          hideDialog={handleDeleteDialog}
          text={`¿Estás seguro de que deseas eliminar el cultivo: ${cropName} y todos sus registros?`}
          confirmDelete={confirmDelete}
          loading={deleteLoading}
          error={deleteError}
        />
      )}
            {showEditDialog && (
        <EditDialog
          hideDialog={handleEditDialog}
          cropName={cropName}
          confirmEdit={confirmEdit}
          loading={editLoading}
          error={editError}
        />
      )}
    </div>
  );
};
