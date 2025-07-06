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

type CropArchiveCardProps = {
  cropId: string;
  cropName: string;
  phase: string;
  startDate: string;
  imageUrl: string;
  quality: string;
};

export const CropArchiveCard = ({
  cropId,
  cropName,
  phase,
  startDate,
  imageUrl,
  quality,
}: CropArchiveCardProps): ReactElement => {
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
    setDeleteDialog(!showEditDialog);
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

  const getIconAndColor = () => {
    switch (quality) {
      case "Excellent":
        return {
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 21C16.9706 21 21 16.9706 21 12C21 10.1666 20.4518 8.46124 19.5103 7.03891L12.355 14.9893C11.6624 15.7589 10.4968 15.8726 9.66844 15.2513L6.4 12.8C5.95817 12.4686 5.86863 11.8418 6.2 11.4C6.53137 10.9582 7.15817 10.8686 7.6 11.2L10.8684 13.6513L18.214 5.48955C16.5986 3.94717 14.4099 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                fill="#465B3F"
              />
            </svg>
          ),
          color: "text-textCardColorE",
        };
      case "Good":
        return {
          icon: (
            <svg
              width="19"
              height="18"
              viewBox="0 0 19 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.33301 18C14.3036 18 18.333 13.9706 18.333 9C18.333 4.02944 14.3036 0 9.33301 0C4.36244 0 0.333008 4.02944 0.333008 9C0.333008 13.9706 4.36244 18 9.33301 18ZM4 8C3.44772 8 3 8.44771 3 9C3 9.55228 3.44772 10 4 10L15 10C15.5523 10 16 9.55229 16 9C16 8.44772 15.5523 8 15 8L4 8Z"
                fill="#282A3F"
              />
            </svg>
          ),
          color: "text-textCardColorR",
        };
      case "Bad":
        return {
          icon: (
            <svg
              width="19"
              height="18"
              viewBox="0 0 19 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.33301 18C14.3036 18 18.333 13.9706 18.333 9C18.333 4.02944 14.3036 0 9.33301 0C4.36244 0 0.333008 4.02944 0.333008 9C0.333008 13.9706 4.36244 18 9.33301 18ZM4 8C3.44772 8 3 8.44771 3 9C3 9.55228 3.44772 10 4 10L15 10C15.5523 10 16 9.55229 16 9C16 8.44772 15.5523 8 15 8L4 8Z"
                fill="#DE4F4F"
              />
            </svg>
          ),
          color: "text-textCardColorM",
        };
      default:
        return {
          icon: <span>{quality}</span>,
          color: "text-secondary",
        };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <div className="flex flex-col cursor-pointer bg-white border-2 rounded-lg overflow-hidden m-2 sm:m-4 hover:opacity-90 duration-300">
      <div className="grid grid-rows-[1fr_auto] w-full overflow-hidden">
        <img
          onClick={() => navigate(`/records/${cropId}/${phase}`)}
          className="object-cover w-full h-auto aspect-video"
          src={imageUrl}
          alt={cropId}
        />
        <div className="flex flex-col  pb-6 justify-center align-middle py-4 px-6 flex-grow space-y-4">
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
                <Dropdown options={options} onOptionSelect={handleItemClick}/>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="flex items-center gap-2">
              <img src="/icons/calendar.svg" alt="calendar"/>
              <strong className="text-primary">
                Fecha de inicio:{" "}
              </strong>
              <p className="text-secondary">{startDate}</p>
            </span>
            <span className="flex items-center gap-2">
              {icon}
              <strong className={`${color}`}>Calidad: </strong>
              <p className={color}>{capitalize(quality)}</p>
            </span>
          </div>
        </div>
      </div>
      {showDeleteDialog && (
        <DeleteDialog
          hideDialog={handleDeleteDialog}
          text={`¿Estás seguro de que deseas eliminar el Crop: ${cropId} y todos sus registros?`}
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
