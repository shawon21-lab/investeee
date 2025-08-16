// lib/company.ts
import mongooseConnect from "@/lib/mongoose";
import Company from "@/models/Company";

export interface CompanyProps {
  _id?: string;
  name: string;
  head?: {
    title?: string;
    description?: string;
    iconUrl?: string;
  };
}

export const getCompanyData = async (): Promise<CompanyProps> => {
  await mongooseConnect();

  let initialCompany: CompanyProps | null;
  const companies = await Company.find<CompanyProps>({});

  if (companies.length <= 0) {
    // If no company exists, create one with defaults
    const newCompany = new Company({
      name: "Enter company name",
      head: {
        title: "Default Title",
        description: "Default Description",
        iconUrl: "https://example.com/image.jpg",
      },
    });
    const savedCompany = await newCompany.save();
    initialCompany = savedCompany.toObject();
  } else {
    initialCompany = companies[0].toObject();
  }

  return JSON.parse(JSON.stringify(initialCompany));
};


