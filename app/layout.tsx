// import { Analytics } from "@vercel/analytics/react";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import ClientOnly from "@/components/ClientOnly";

import { getCompanyData } from "@/lib/company"; // ✅ properly imported
import mongooseConnect from "@/lib/mongoose";
import Company from "@/models/Company";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: true,
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  await mongooseConnect();
  const companies = await Company.find<CompanyProps>({});
  const company = companies[0];

  return {
    title: company?.head?.title || "Not set",
    icons:
      company?.head?.iconUrl && company?.head?.iconUrl.startsWith("https")
        ? company?.head?.iconUrl
        : company?.head?.iconUrl?.replace("http", "https") ||
          "https://example.com/image.jpg",
    description: company?.head?.description || "Not set",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const company = await getCompanyData(); // raw data from DB

  // ✅ Ensure all required CompanyProps fields are safe
  const safeCompany: CompanyProps = {
    name: company?.name || "Default Company",
    baseUrl: company?.baseUrl || "https://example.com",
    nowPaymentApi: company?.nowPaymentApi || "",
    address: company?.address || "Not provided",
    email: company?.email || "info@example.com",
    phone: company?.phone || "000-000-0000",
    currency: company?.currency || "USD",
    lastInvestmentDailyCronJob: company?.lastInvestmentDailyCronJob || new Date(),
    head: {
      title: company?.head?.title || "Default Title",
      description: company?.head?.description || "Default Description",
      iconUrl: company?.head?.iconUrl || "https://example.com/icon.png",
    },
    // add all other fields your CompanyProps requires:
    footerText: company?.footerText || "© Default Company",
    socialLinks: company?.socialLinks || [],
    theme: company?.theme || "light",
  };

  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${nunito.className} max-w-[2520px] min-h-screen`}>
          {/* ✅ Always pass safeCompany instead of raw company */}
          <ClientOnly companyData={safeCompany}>
            <ToastProvider />
            {children}
          </ClientOnly>
        </body>
      </html>
    </AuthProvider>
  );
}

