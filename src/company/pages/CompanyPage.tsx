import { ReactElement, useEffect, useState } from "react";
import { BaseLayout } from "@/shared/layouts/BaseLayout.tsx";
import { useCompanyPage } from "@/company/hooks/useCompanyPage.hook.tsx";
import { LoaderMessage } from "@/shared/components/LoaderMessage.tsx";
import { Table } from "@/shared/components/Table.tsx";
import { Profile } from "@/auth/models/Profile.ts";
import { BannerComponent } from "@/shared/components/Banner";
import { InviteComponent } from "../components/InviteWorkerComponent";
import { SearchBar } from "@/shared/components/SearchBar";
import { PrimaryButton } from "@/shared/components/Buttons";
import { Filter } from "@/shared/components/Filter";
import { SideBar } from "@/shared/components/SideBar";
import { TextField } from "@/shared/components/TextField";
import { ProfileService } from "@/profile/services/profile.service";
import { useAuthStore } from "@/auth/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { getMembershipByCompnyId, getMembershipBenefitsByMembershipName } from "@/membership/services/membership.service";
import { Membership } from "@/membership/models/Memberships";
import { MembershipLevel } from "@/membership/models/MembershipLevel";

export const CompanyPage = (): ReactElement => {
  const { isLoading, company, employees } = useCompanyPage();
  const [sortOrder, setSortOrder] = useState(false);
  const [showDialog, setDialog] = useState(false);
  const [showSidebar, setSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [maxValue, setMaxValue] = useState(0);
  const [invitedWorkers, setInvitedWorkers] = useState(false);
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.profile);
  const navigate = useNavigate();
  const [text, setText] = useState("")

  const [selectedProfile, setSelectedProfile] = useState<Profile>({
    id: "",
    userId: "",
    firstName: "",
    lastName: "",
    iconUrl: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (company?.id) {
      const fetchData = async () => {
        const result = await getMembershipByCompnyId(company.id);
        if (result.status === "success") {
          const data = result.data as Membership;
          const response = await getMembershipBenefitsByMembershipName(data.membershipLevelName);
          if (response.status === "success") {
            const information = response.data as MembershipLevel;
            setMaxValue(information.benefits[0].value);
          }
        }
      };
      fetchData();
    }
  }, [company?.id]);

  useEffect(() => {
    if (employees.length >= maxValue) {
      setInvitedWorkers(true);
      setText("Limite de trabajadores alcanzado")
    } else {
      setInvitedWorkers(false);
      setText("Invitar Trabajador")
    }
  }, [employees, maxValue]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => !prevOrder);
  };

  const handleSidebar = () => {
    setSidebar(!showSidebar);
  };

  const handleProfileSelection = (profile: Profile) => {
    if (profile.userId === userId?.userId) {
      navigate("/profile");
    } else {
      setSelectedProfile(profile);
      handleSidebar();
    }
  };

  const handleClickInvite = () => {
    setDialog(!showDialog);
  };

  const handleUpdateProfile = async () => {
    if (!token) {
      setError("No estás autenticado.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await ProfileService.editProfile(
        selectedProfile.id,
        selectedProfile.firstName,
        selectedProfile.lastName,
        selectedProfile.iconUrl,
        token
      );

      if (response.status === "success") {
        alert("Perfil actualizado exitosamente.");
        handleSidebar();
      } else {
        setError(response.message || "Error al actualizar el perfil.");
      }
    } catch (err) {
      setError("Hubo un problema al actualizar el perfil.");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const handleFieldChange = (field: keyof Profile, value: string) => {
    setSelectedProfile((prevProfile) => ({
      ...prevProfile,
      [field]: value,
    }));
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return sortOrder ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
  });

  const filteredEmployees = sortedEmployees.filter(
    (profile) =>
      profile.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <BaseLayout>
        <div className="flex justify-center items-center h-full">
          <LoaderMessage message="Cargando información de la empresa." />
        </div>
      </BaseLayout>
    );
  }

  if (!company) {
    return (
      <BaseLayout>
        <div className="flex justify-center items-center h-full">
          <p>Crear compañía</p>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      {showDialog && <InviteComponent hideDialog={handleClickInvite} />}
      <BannerComponent />
      <div className="relative mb-4 mx-auto w-[80vw] flex items-center md:flex-row flex-col gap-9">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <PrimaryButton size="small" onClick={handleClickInvite} disabled={invitedWorkers}>
          <span>{text}</span>
        </PrimaryButton>
      </div>
      <div className="justify-center w-[80vw] mx-auto text-third text-lg">
        <strong>Directorio de trabajadores</strong>
      </div>
      <div className="mt-6 w-[80vw] mx-auto">
        <Table<Profile>
          data={filteredEmployees}
          columnNames={[
            <div className="flex gap-1 justify-center">
              <Filter
                label="Nombre"
                onClick={toggleSortOrder}
                trailingIcon="/icons/sortIcon.svg"
                clickedState={sortOrder}
                color="text-third"
              />
            </div>,
            "Cargo dentro de la empresa",
            "Acciones",
          ]}
          columnValues={[
            (profile) => (
              <div className="flex gap-2.5 items-center justify-center">
                <img
                  src={profile.iconUrl}
                  alt="User Image"
                  className="size-10 rounded-full "
                />
                <span>
                  {profile.firstName} {profile.lastName}
                </span>
              </div>
            ),
            (profile) => profile.role,
            (profile) => (
              <button
                onClick={() => handleProfileSelection(profile)}
                className="p-3"
              >
                <img src="/icons/dots.svg" alt="more" />
              </button>
            ),
          ]}
        />
        <SideBar isOpen={showSidebar} onClose={handleSidebar}>
          <div className="p-4">
            <div className="flex flex-col items-center mb-4">
              <img
                src={selectedProfile.iconUrl}
                alt="Foto de perfil"
                className="w-52 h-52 object-cover object-center rounded-full border-2 border-primary"
              />
            </div>
            <div>
              <TextField
                id="first-name"
                type="text"
                label="Nombre"
                value={selectedProfile.firstName}
                onValueChange={(value) => handleFieldChange("firstName", value)}
              />
              <TextField
                id="last-name"
                type="text"
                label="Apellido"
                value={selectedProfile.lastName}
                onValueChange={(value) => handleFieldChange("lastName", value)}
              />
              <TextField
                id="icon-url"
                type="text"
                label="URL de la foto de perfil"
                value={selectedProfile.iconUrl}
                onValueChange={(value) => handleFieldChange("iconUrl", value)}
              />
              <div className="mt-6 space-y-2">
                <PrimaryButton
                  onClick={handleUpdateProfile}
                  label={loading ? "Actualizando..." : "Actualizar datos"}
                  disabled={loading}
                />
                {error && <p className="text-red-500">{error}</p>}
              </div>
            </div>
          </div>
        </SideBar>
      </div>
    </BaseLayout>
  );
};
