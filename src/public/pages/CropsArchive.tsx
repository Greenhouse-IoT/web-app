import { ReactElement, useEffect, useState } from "react";
import { getCrops } from "@/public/services/crops.service";
import { CropDone, CropWrapper } from "@/public/models/Crop";
import { BaseLayout } from "@/shared/layouts/BaseLayout";
import { LoaderMessage } from "@/shared/components/LoaderMessage";
import { CropArchiveCard } from "@/crops/components/CropArchiveCard";
import { BannerComponent } from "@/shared/components/Banner";
import { Dropdown } from "@/shared/components/DropDownComponent";
import { SearchBar } from "@/shared/components/SearchBar";
import { useCompanyPage } from "@/company/hooks/useCompanyPage.hook.tsx";
import { Filter } from "@/shared/components/Filter";

export const CropsArchivePage = (): ReactElement => {
  const [crops, setCrops] = useState<CropDone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [openCropQualityFilter, setOpenCropQualityFilter] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Todos");

  const options = ["Todos", "Excelente", "Regular", "Mala"];

  const { company } = useCompanyPage();

  const toggleDateSorting = () => {
    setOpenDateFilter(!openDateFilter);
  };

  const handleItemClick = (option: string) => {
    setSelectedOption(option);
    setDropdown(false);
  };

  const filteredCrops = crops
    .filter(
      (crop) =>
        crop.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.startDate.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((crop) => !crop.state && selectedOption === "Todos"); 

  const sortedCrops = filteredCrops.sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return openDateFilter ? dateA - dateB : dateB - dateA;
  });

  useEffect(() => {
    const fetchData = async () => {
      if (company?.id) {
        const result = await getCrops(company?.id);
        if (result.status === "success") {
          const data = result.data as unknown as CropWrapper;
          setCrops(data.crops || []);
          setError(null);
        } else {
          setError(result.data as string);
        }
        setLoading(false);
      }
    };

    if (company?.id && loading) {
      fetchData();
    }
  }, [company]);



  if (loading) {
    return (
      <BaseLayout>
        <div className="flex justify-center items-center h-full">
          <LoaderMessage message="Cargando la lista de cultivos en progreso." />
        </div>
      </BaseLayout>
    );
  }

  if (error) {
    return (
      <BaseLayout>
        <div className="flex justify-center items-center h-full">
          <LoaderMessage message="No se encontraron cultivos en progreso." />
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <BannerComponent />
      <div className="max-w-full h-auto">
        <div className="relative mb-4 mx-auto w-[80vw] flex items-center md:flex-row flex-col gap-9">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Filter
            label={openDateFilter ? 'Más recientes' : 'Más antiguos'}
            onClick={toggleDateSorting}
            trailingIcon="/icons/sortIcon.svg"
            clickedState={openDateFilter}
          />
          <div className="relative flex">
            <Filter
              label={`Calidad: ${selectedOption}`}
              leadingIcon="/icons/filterIcon.svg"
              trailingIcon="/icons/downArrow.svg"
              onClick={() => {
                setOpenCropQualityFilter(!openCropQualityFilter),
                  setDropdown(!dropdown);
              }}
              clickedState={openCropQualityFilter}
            />
            {dropdown && (
              <div className="absolute translate-y-8">
                <Dropdown options={options} onOptionSelect={handleItemClick} />
              </div>
            )}
          </div>
        </div>
        <div className="justify-center w-[80vw] mx-auto text-third text-lg">
          <strong>Cultivos</strong>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 w-[80vw] mt-6 justify-center mx-auto">
          {sortedCrops.map((crop) => (
            <CropArchiveCard
              key={crop.id}
              cropId={crop.id}
              cropName={crop.name}
              phase={crop.phase}
              startDate={crop.startDate}
              imageUrl={crop.imageUrl || "/mushroom_images/hongos2.webp"}
              quality={crop.quality || ""}
            />
          ))}
        </div>
      </div>
    </BaseLayout>
  );
};
