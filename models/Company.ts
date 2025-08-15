import { Schema, model, models } from "mongoose";

interface CompanyProps {
  name: string;
  baseUrl: string;
  nowPaymentApi: string;
  address: string;
  //this is for meta data
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
    percentToPay: number; //percentage the receiver needs to deposit to clear the pending transfer if mode is set to pending-mode
    mode: "direct-mode" | "pending-mode";
    allowTransferIfPendingAvailable: "yes" | "no";
  };

  desposit: {
    minimum: number;
    maximum: number;
  };

  withdraw: {
    minimum: number;
    maximum: number;
    coinWithdrawal: "on" | "off";
    bankWithdrawal: "on" | "off";
  };

  signupBonus: {
    status: "on" | "off";
    amount: number;
  };

  loan: {
    status: "on" | "off";
    minimum: number;
    maximum: number;
  };

  payment: {
    bankTransfer: "on" | "off";
    manualCoinPayment: "on" | "off";
    automaticCoinPayment: "on" | "off";
  };

  color: {
    primary: string;
    primaryLight: string;
    primaryVeryLight: string;
  };

  emailSetup: {
    host: string;
    port: number;
    secure: boolean;
    from: string;
    auth: { user: string; pass: string };
  };
}

const companySchema = new Schema<CompanyProps>(
  {
    name: { type: String, trim: true, default: "not set" },
    baseUrl: { type: String, trim: true, default: "not set" },
    nowPaymentApi: {
      type: String,
      trim: true,
      default: "not set",
    },
    address: {
      type: String,
      trim: true,
      default: "408 Warren Rd - San Mateo, CA 94402",
    },

    head: {
      iconUrl: { type: String, default: "https://example.com/image.jpg" },
      title: { type: String, default: "not set" },
      description: { type: String, default: "not set" },
    },

    lastInvestmentDailyCronJob: { type: Number, default: 0 },

    logo: {
      url: { type: String, default: "https://example.com/image.jpg" },
      public_id: { type: String, default: "not set" },
      secure_url: { type: String, default: "https://example.com/image.jpg" },
      format: { type: String, default: "not set" },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      bytes: { type: Number, default: 0 },
      original_filename: { type: String, default: "not set" },
      created_at: { type: String, default: "not set" },
      etag: { type: String, default: "not set" },
      thumbnail_url: { type: String, default: "not set" },
    },

    welcomeEmail: {
      status: { type: String, default: "off", enum: ["on", "off"] },
      emailMessage: { type: String, default: "Welcome" },
    },

    currency: {
      name: { type: String, default: "United States Dollar" },
      code: { type: String, default: "USD" },
      symbol: { type: String, default: "$" },
    },

    transfer: {
      minimum: { type: Number, default: 0 },
      maximum: { type: Number, default: 0 },
      percentToPay: { type: Number, default: 0 },
      mode: {
        type: String,
        default: "direct-mode",
        enum: ["direct-mode", "pending-mode"],
      },
      allowTransferIfPendingAvailable: {
        type: String,
        default: "yes",
        enum: ["yes", "no"],
      },
    },

    desposit: {
      minimum: { type: Number, default: 0 },
      maximum: { type: Number, default: 0 },
    },

    withdraw: {
      minimum: { type: Number, default: 0 },
      maximum: { type: Number, default: 0 },
    },

    signupBonus: {
      status: { type: String, default: "off", enum: ["on", "off"] },
      amount: { type: Number, default: 0 },
    },

    loan: {
      status: { type: String, default: "off", enum: ["on", "off"] },
      minimum: { type: Number, default: 0 },
      maximum: { type: Number, default: 0 },
    },

    payment: {
      bankTransfer: { type: String, default: "off", enum: ["on", "off"] },
      manualCoinPayment: { type: String, default: "off", enum: ["on", "off"] },
      automaticCoinPayment: {
        type: String,
        default: "off",
        enum: ["on", "off"],
      },
    },

    color: {
      primary: { type: String, trim: true, default: "#c32f27" },
      primaryLight: {
        type: String,
        trim: true,
        default: "#e35d56",
      },
      primaryVeryLight: {
        type: String,
        trim: true,
        default: "#f2dcdc",
      },
    },

    emailSetup: {
      host: { type: String, trim: true, default: "not set" },
      port: { type: Number, default: 0 },
      secure: { type: Boolean, default: true },
      from: { type: String, trim: true, default: "not set" },
      auth: {
        user: { type: String, default: "not set" },
        pass: { type: String, default: "not set" },
      },
    },
  },
  { timestamps: true }
);

export default models.Company || model<CompanyProps>("Company", companySchema);
