declare interface TransactionProps {
  title: string;

  amount: number;

  senderName?: string;

  amountToDeposit?: number;

  despositedAmount?: number;

  pendingBalance?: number;

  paymentTitle?: string;

  receiverName?: string;

  receiverEmail?: string;

  receiverPhoneNumber?: string;

  receiverAccountNumber?: string;

  receiverPaymentUsername?: string;

  linkedTransactionId?: string;

  loanDuration?: string;

  loanDurationDate?: number;

  loanReason?: string;

  userId: string;

  _id?: string;

  note?: string;

  paymentProof?: {
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
    created_at: Date;
    updated_at: Date;
    purchase_id: string;
    amount_received: number;
    payin_extra_id: string;
    smart_contract: string;
    network: string;
    network_precision: string;
    time_limit: Date;
    expiration_estimate_date: Date;
    is_fixed_rate: string;
    valid_until: Date;
    type: string;
  };

  createdAt?: Date;

  updatedAt?: string;

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
