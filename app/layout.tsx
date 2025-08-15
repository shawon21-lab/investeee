// import { Analytics } from "@vercel/analytics/react";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import ClientOnly from "@/components/ClientOnly";

import mongooseConnect from "@/lib/mongoose";
import Company from "@/models/Company";
import nextLogger from "@/constants/logger";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "500", "700"],
  preload: true,
  style: ["italic", "normal"],
});

export const getCompanyData = async () => {
  await mongooseConnect();
  let initialCompany: CompanyProps | null;
  const companies = await Company.find<CompanyProps>({});

  if (companies.length <= 0) {
    const newCompany = new Company({ name: "Enter company name" });
    const savedCompany = await newCompany.save();
    initialCompany = savedCompany;
  } else {
    initialCompany = companies[0];
  }
  const plainObject: CompanyProps = JSON.parse(JSON.stringify(initialCompany));
  return plainObject;
};

export async function generateMetadata(): Promise<Metadata> {
  await mongooseConnect();
  const companies = await Company.find<CompanyProps>({});
  const company = companies[0];

  return {
    title: company?.head?.title || "Not set",

    icons: company?.head?.iconUrl.startsWith("https")
      ? company?.head?.iconUrl
      : company?.head?.iconUrl.replace("http", "https") ||
        "https://example.com/image.jpg",

    description: company?.head?.description || "Not set",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const company = await getCompanyData();

  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${nunito.className} max-w-[2520px] min-h-screen`}>
          <ClientOnly companyData={company}>
            <ToastProvider />
            {children}
          </ClientOnly>
        </body>
      </html>
    </AuthProvider>
  );
}
