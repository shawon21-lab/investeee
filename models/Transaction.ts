import mongoose, { Schema, model, Types, models } from "mongoose";

interface TransactionProps {
  title: string;

  amount: number;

  senderName?: string;

  amountToDeposit?: number;

  despositedAmount?: number;

  pendingBalance?: number;

  paymentTitle: string;

  receiverName?: string;

  receiverEmail?: string;

  receiverPhoneNumber?: string;

  receiverAccountNumber?: string;

  receiverPaymentUsername?: string;

  loanDuration: string;

  loanDurationDate?: number;

  loanReason: string;

  userId?: Types.ObjectId;

  note?: string;

  paymentProof: {
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

  automaticCoinPayment?: {
    payment_id: string;
    payment_status: string;
    pay_address: string;
    price_amount: number;
    price_currency: string;
    pay_amount: number;
    pay_currency: string;
    order_id: string;
    order_description: string;
    ipn_callback_url: string;
    created_at: string | Date;
    updated_at: string | Date;
    purchase_id: string;
    amount_received: number;
    payin_extra_id: string;
    smart_contract: string;
    network: string;
    network_precision: string;
    time_limit: string | Date;
    expiration_estimate_date: string | Date;
    is_fixed_rate: string;
    valid_until: string | Date;
    type: string;
  };

  createdAt: string;

  linkedTransactionId?: string;

  status:
    | "successful"
    | "pending"
    | "processing"
    | "action-needed"
    | "rejected";

  category:
    | "money-received"
    | "transfer"
    | "deposit"
    | "loan"
    | "investment-topup"
    | "investment-withdrawal";

  type?: "automatic-coin-payment" | "manual-coin-payment" | "bank-transfer";
  coinName?: string;
  walletAddress?: string;
}

const transactionSchema = new Schema<TransactionProps>(
  {
    title: { type: String, trim: true, required: true },
    amount: { type: Number, required: true },
    userId: { type: Types.ObjectId, required: true },

    senderName: { type: String },
    receiverName: { type: String },
    receiverEmail: { type: String },
    receiverPhoneNumber: { type: String },
    receiverAccountNumber: { type: String },
    receiverPaymentUsername: { type: String },

    note: String,
    amountToDeposit: Number,
    despositedAmount: Number,
    pendingBalance: Number,
    paymentTitle: { type: String },

    paymentProof: {
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

    automaticCoinPayment: {
      payment_id: { type: String },
      payment_status: { type: String },
      pay_address: { type: String },
      price_amount: { type: Number },
      price_currency: { type: String },
      pay_amount: { type: Number },
      pay_currency: { type: String },
      order_id: { type: String },
      order_description: { type: String },
      ipn_callback_url: { type: String },
      created_at: { type: Date },
      updated_at: { type: Date },
      purchase_id: { type: String },
      amount_received: { type: Number },
      payin_extra_id: { type: String },
      smart_contract: { type: String },
      network: { type: String },
      network_precision: { type: String },
      time_limit: { type: Date },
      expiration_estimate_date: { type: Date },
      is_fixed_rate: { type: String },
      valid_until: { type: Date },
      type: { type: String },
    },

    linkedTransactionId: { type: Types.ObjectId },

    loanDuration: { type: String },
    loanReason: String,
    loanDurationDate: { type: Number },

    status: {
      type: String,
      required: true,
      enum: [
        "successful",
        "pending",
        "processing",
        "action-needed",
        "rejected",
      ],
    },

    category: {
      type: String,
      required: true,
      enum: [
        "money-received",
        "transfer",
        "deposit",
        "loan",
        "investment-topup",
        "investment-withdrawal",
      ],
    },

    type: {
      type: String,
      enum: ["automatic-coin-payment", "manual-coin-payment", "bank-transfer"],
    },

    walletAddress: {
      type: String,
      trim: true,
    },

    coinName: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default models.Transaction ||
  model<TransactionProps>("Transaction", transactionSchema);
