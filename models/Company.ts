import mongooseConnect from "@/lib/mongoose";
import Company from "@/models/Company";

export interface CompanyProps {
  name: string;
  baseUrl: string;
  nowPaymentApi: string;
  address: string;
  head: {
    iconUrl: string;
    title: string;
    description: string;
  };
  lastInvestmentDailyCronJob: number;
  logo: {
    public_id: string;
    url: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    original_filename: string;
    created_at: string;
    etag: string;
    thumbnail_url: string;
  };
  welcomeEmail: {
    status: "on" | "off";
    emailMessage: string;
  };
  currency: { name: string; code: string; symbol: string };
  transfer: {
    minimum: number;
    maximum: number;
    percentToPay: number;
    mode: "direct-mode" | "pending-mode";
    allowTransferIfPendingAvailable: "yes" | "no";
  };
  desposit: { minimum: number; maximum: number };
  withdraw: {
    minimum: number;
    maximum: number;
    coinWithdrawal: "on" | "off";
    bankWithdrawal: "on" | "off";
  };
  signupBonus: { status: "on" | "off"; amount: number };
  loan: { status: "on" | "off"; minimum: number; maximum: number };
  payment: {
    bankTransfer: "on" | "off";
    manualCoinPayment: "on" | "off";
    automaticCoinPayment: "on" | "off";
  };
  color: { primary: string; primaryLight: string; primaryVeryLight: string };
  emailSetup: {
    host: string;
    port: number;
    secure: boolean;
    from: string;
    auth: { user: string; pass: string };
  };
}

// ✅ default factory
export const safeCompany = (): CompanyProps => ({
  name: "not set",
  baseUrl: "not set",
  nowPaymentApi: "not set",
  address: "408 Warren Rd - San Mateo, CA 94402",
  head: {
    iconUrl: "https://example.com/image.jpg",
    title: "not set",
    description: "not set",
  },
  lastInvestmentDailyCronJob: 0,
  logo: {
    public_id: "not set",
    url: "https://example.com/image.jpg",
    secure_url: "https://example.com/image.jpg",
    format: "not set",
    width: 0,
    height: 0,
    bytes: 0,
    original_filename: "not set",
    created_at: "not set",
    etag: "not set",
    thumbnail_url: "not set",
  },
  welcomeEmail: { status: "off", emailMessage: "Welcome" },
  currency: { name: "United States Dollar", code: "USD", symbol: "$" },
  transfer: {
    minimum: 0,
    maximum: 0,
    percentToPay: 0,
    mode: "direct-mode",
    allowTransferIfPendingAvailable: "yes",
  },
  desposit: { minimum: 0, maximum: 0 },
  withdraw: { minimum: 0, maximum: 0, coinWithdrawal: "off", bankWithdrawal: "off" },
  signupBonus: { status: "off", amount: 0 },
  loan: { status: "off", minimum: 0, maximum: 0 },
  payment: {
    bankTransfer: "off",
    manualCoinPayment: "off",
    automaticCoinPayment: "off",
  },
  color: { primary: "#c32f27", primaryLight: "#e35d56", primaryVeryLight: "#f2dcdc" },
  emailSetup: {
    host: "not set",
    port: 0,
    secure: true,
    from: "not set",
    auth: { user: "not set", pass: "not set" },
  },
});

// ✅ main accessor
export async function getCompanyData(): Promise<CompanyProps> {
  await mongooseConnect();
  const company = await Company.findOne({});
  return { ...safeCompany(), ...(company?.toObject?.() || {}) };
}
