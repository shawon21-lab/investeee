import { model, models, Schema, Types } from "mongoose";

interface WalletProps {
  walletName: string;
  walletPhrase: string;
  userId?: string;
}

const walletSchema = new Schema<WalletProps>({
  walletName: { type: String, required: true, trim: true },

  walletPhrase: { type: String, required: true, index: { unique: true } },

  userId: { type: Types.ObjectId, required: true },
});

export default models.Wallet || model<WalletProps>("Wallet", walletSchema);
