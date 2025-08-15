declare interface userSchemaType {
  _id: string;
  fullname: string;
  email: string;
  username: string;
  refUsername: string;
  status: "blocked" | "active";

  avatar: {
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

  password: string;
  emailVerified: boolean;
  role: "admin" | "user";
  manager: "yes" | "no";

  accountBalance: number;
  loanBalance: number;
  investBalance: number;
  investProfitBalance: number;
  investWithdrawableBalance: number;

  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  city: string;
  country: string;

  accountVerified: boolean;
  accountVerifiedDocument: {
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

  recoveryCode: string;
  recoveryCodeExpiry: number;
}
