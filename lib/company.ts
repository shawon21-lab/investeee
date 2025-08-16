import mongooseConnect from "@/lib/mongoose";
import Company from "@/models/Company";

export const getCompanyData = async () => {
  await mongooseConnect();
  const companies = await Company.find({});
  return companies[0] || null;
};
