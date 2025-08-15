import { create } from "zustand";

interface UseCompanyProps {
  company: CompanyProps | null;
  onCompany: (companyData: CompanyProps) => void;
}

const useCompany = create<UseCompanyProps>((set) => ({
  company: null,
  onCompany: (companyData: CompanyProps) => set({ company: companyData }),
}));

export default useCompany;
