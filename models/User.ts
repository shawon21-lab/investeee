import mongoose, { Schema, model } from "mongoose";

interface userSchemaType extends Document {
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

const userSchema = new Schema<userSchemaType>(
  {
    fullname: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    password: { type: String, required: true },

    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    refUsername: { type: String, trim: true, lowercase: true },

    status: { type: String, default: "active" },

    avatar: {
      url: { type: String },
      public_id: { type: String },
      secure_url: { type: String },
      format: { type: String },
      width: { type: Number },
      height: { type: Number },
      bytes: { type: Number },
      original_filename: { type: String },
      created_at: { type: String },
      etag: { type: String },
      thumbnail_url: { type: String },
    },

    emailVerified: { type: Boolean, default: false },

    dateOfBirth: { type: String, trim: true },
    address: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },

    role: { type: String, enum: ["admin", "user"], default: "user" },
    manager: { type: String, enum: ["yes", "no"], default: "no" },

    accountBalance: { type: Number, default: 0 },
    loanBalance: { type: Number, default: 0 },
    investBalance: { type: Number, default: 0 },
    investProfitBalance: { type: Number, default: 0 },
    investWithdrawableBalance: { type: Number, default: 0 },

    accountVerified: { type: Boolean, default: false },
    accountVerifiedDocument: {
      url: { type: String },
      public_id: { type: String },
      secure_url: { type: String },
      format: { type: String },
      width: { type: Number },
      height: { type: Number },
      bytes: { type: Number },
      original_filename: { type: String },
      created_at: { type: String },
      etag: { type: String },
      thumbnail_url: { type: String },
    },

    recoveryCode: { type: String },
    recoveryCodeExpiry: { type: Number },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

export default mongoose.models.User ||
  model<userSchemaType>("User", userSchema);
