declare interface CoinProps {
  label: string;
  value: string;
  allowed: "yes" | "no";
  _id: string;
  createdAt: Date;
  walletAddress: string;
}
