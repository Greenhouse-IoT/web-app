import ReactDOM from "react-dom";
import { ReactElement, MouseEvent, useState, useEffect } from "react";
import { PrimaryButton } from "./Buttons";
import { TextField } from "./TextField";

type EditDialogProps = {
  hideDialog: () => void;
  cropName?: string; 
  loading: boolean;
  error: string | null;

  confirmEdit: (updatedData: { name: string }) => Promise<void>;
};

export const EditDialog = ({
  hideDialog,
  cropName = "",
  loading,
  error,
  confirmEdit,
}: EditDialogProps): ReactElement => {

  const [name, setName] = useState<string>(cropName);

  useEffect(() => {
    setName(cropName);
  }, [cropName]);

  const handleOutsideClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      hideDialog();
    }
  };

  const onSubmit = () => {
    if (!name.trim()) {
      return;
    }
    confirmEdit({ name });
  };

  const dialog = (
    <div
      className="fixed inset-0 backdrop-blur-xs bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-2xl p-5 w-full max-w-md mx-auto shadow-lg relative">
        <div className="flex flex-col justify-center text-center">
          <h1 className="py-5 font-semibold text-xl">
            Editar cultivo: {cropName || "—"}
          </h1>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <TextField
            id="editCropName"
            type="text"
            label="Nombre del cultivo"
            placeholder="Ingrese el nombre del cultivo"
            value={name}
            onValueChange={setName}
          />

          <div className="flex flex-col p-5 gap-2">
            <PrimaryButton
              disabled={loading}
              type="button"
              label={loading ? "Aplicando cambios..." : "Editar"}
              onClick={onSubmit}
              variant="primary"
            />
            <button
              onClick={hideDialog}
              className="bg-gray-200 p-2 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(dialog, document.body);
};
