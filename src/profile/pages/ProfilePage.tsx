import { ReactElement, useState } from "react";
import { useAuthStore } from "@/auth/stores/useAuthStore.ts";
import { PrimaryButton } from "@/shared/components/Buttons";
import { BaseLayout } from "@/shared/layouts/BaseLayout.tsx";
import { TextField } from "@/shared/components/TextField.tsx";
import { ProfileService } from "../services/profile.service";

export const ProfilePage = (): ReactElement => {
  const profile = useAuthStore((state) => state.profile)!;
  const token = useAuthStore((state) => state.token);
  const setProfile = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const [firstName, setFirstName] = useState<string>(profile.firstName);
  const [lastName, setLastName] = useState<string>(profile.lastName);
  const [iconUrl, setIconUrl] = useState<string>(profile.iconUrl);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateProfile = async () => {
    if (!token) {
      setError("No estás autenticado.");
      return;
    }

    if (
    firstName === profile.firstName &&
    lastName === profile.lastName &&
    iconUrl === profile.iconUrl
  ) {
    setError("No se realizaron cambios en el perfil.");
    return;
  }

  setLoading(true);
  setError(null);

    try {
      const response = await ProfileService.editProfile(
        profile.id,
        firstName,
        lastName,
        iconUrl,
        token
      );
      if (response.status === "success") {
        setProfile(token, response.payload);
        alert("Perfil actualizado exitosamente");
      } else {
        setError(response.message || "Error al actualizar el perfil.");
      }
    } catch (err) {
      setError("Hubo un problema al actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseLayout>
      <div className="mx-auto rounded-2xl drop-shadow-md p-12 bg-white max-w-96">
        <img
          src={iconUrl}
          alt="Foto de perfil"
          className="size-52 mx-auto object-cover object-center rounded-full border-2 border-primary"
        />
        <div className="pt-4">
          <TextField
            id="first-name"
            type="text"
            label="Nombre"
            value={firstName}
            onValueChange={setFirstName}
          />
          <TextField
            id="last-name"
            type="text"
            label="Apellido"
            value={lastName}
            onValueChange={setLastName}
          />
          <TextField
            id="icon-url"
            type="text"
            label="URL de la foto de perfil"
            value={iconUrl}
            onValueChange={setIconUrl}
          />
          <div className="mt-6 space-y-2">
            <PrimaryButton
              onClick={handleUpdateProfile}
              label={loading ? "Actualizando..." : "Actualizar datos"}
              disabled={loading}
            />
            {error && <p className="text-red-500">{error}</p>}
            <PrimaryButton variant="secondary" onClick={logout} label="Cerrar sesión" />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};
