declare interface CompanyProps {
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

  _id: string;
}
