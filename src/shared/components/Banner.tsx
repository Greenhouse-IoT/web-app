import { ReactElement, useState, useEffect } from "react";
import { useCompanyPage } from "@/company/hooks/useCompanyPage.hook.tsx";
import { EditCompanyComponent } from "@/company/components/EditCompanyComponent";
import { getMembershipByCompnyId } from "@/membership/services/membership.service";
import { useLocation } from "react-router-dom";

export const BannerComponent = (): ReactElement => {
  const [changeInfo, setChangeInfo] = useState(false);

  const location = useLocation();
  const activePage = location.pathname === "/company"

  const { company } = useCompanyPage();

  const handleEditCompany = () => {
    setChangeInfo(!changeInfo);
  };

  useEffect(() => {
    if (company?.id) {
      const fetchData = async () => {
        const result = await getMembershipByCompnyId(company.id);
        if (result.status === "success") {


        }
      };
      fetchData();
    }
  }, [company?.id])


  return (
    <div className="flex w-full">
      <img
        src="bannerImage.webp"
        alt="bannerImage"
        className="absolute w-full hidden sm:hidden md:hidden lg:block xl:block 2xl:block"
      />
      <div className="relative z-10 flex md:flex-row flex-col md:items-end items-center md:text-left text-center md:px-28 px-12 2xl:pt-32 xl:pt-16 lg:pt-5 pb-10 md:gap-5 gap-2 w-full">
        <img
          src={company?.logoUrl}
          alt={`${company?.name} logo`}
          className="size-32 md:size-48 object-cover object-center bg-no-repeat bg-transparent rounded-2xl border-2 border-secondary"
        />
        <button
          className={`absolute md:translate-x-40 md:translate-y-4 translate-x-16 translate-y-24 ${
            activePage ? "" : "hidden"
          }`}
          onClick={handleEditCompany}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className=""
          >
            <circle cx="24.0001" cy="23.9999" r="16.5333" fill="white" />
            <path
              d="M24 4C12.94 4 4 12.94 4 24C4 35.06 12.94 44 24 44C35.06 44 44 35.06 44 24C44 12.94 35.06 4 24 4ZM30.2 14.14C30.48 14.14 30.76 14.24 31 14.46L33.54 17C34 17.44 34 18.14 33.54 18.56L31.54 20.56L27.44 16.46L29.44 14.46C29.64 14.24 29.92 14.14 30.2 14.14ZM26.26 17.62L30.38 21.74L18.26 33.86H14.14V29.74L26.26 17.62Z"
              fill="#4C6444"
            />
          </svg>
        </button>
        <div className="items-end">
          <div className="flex">
            <h1 className="placeholder:text-third capitalize text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 text-third whitespace-nowrap font-bold bg-transparent">
              {company?.name}
            </h1>
          </div>
          <div className="flex">
            <p className="placeholder:text-secondary text-base sm:text-xs md:text-sm lg:text-lg whitespace-nowrap bg-transparent">
              {company?.tin}
            </p>
          </div>
        </div>
      </div>
      {changeInfo && company && (
        <EditCompanyComponent
          hideDialog={handleEditCompany}
          company={company}
        />
      )}
    </div>
  );
};
