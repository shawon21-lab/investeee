"use client";

import Button from "@/components/Button";
import useTheme from "@/components/hooks/useTheme";
import React, { useEffect, useState } from "react";
import WhyModal from "./WhyModal";
import { useRouter } from "next/navigation";

import { FaMoneyBillWave, FaHandHoldingUsd, FaCopy } from "react-icons/fa";
import { BiTransfer } from "react-icons/bi";
import { AiOutlineCreditCard } from "react-icons/ai";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import formatNumber from "@/constants/formatNumber";
import axios from "axios";
import { toast } from "react-hot-toast";
import YouTube from "react-youtube";
import ManualCoinPaymentTransaction from "./ManualCoinPaymentTransaction";
import { CopyButton } from "@mantine/core";
import AutomaticCoinPaymentTransaction from "./AutomaticCoinPaymentTransaction";
import sucessful from "@/public/lottie/sucessful.json";

import Lottie from "lottie-react";
import useCompany from "@/components/hooks/useCompany";

interface TransactionInfoProp {
  transaction: TransactionProps;
}

const TransactionInfo = (props: TransactionInfoProp) => {
  const { transaction } = props;
  const { mode } = useTheme();
  const [showWhyModal, setShowWhyModal] = useState(false);
  const router = useRouter();
  const showDepositedAmount =
    transaction.despositedAmount || transaction.despositedAmount === 0;

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;

  const currency = company?.currency.symbol;

  return (
    <>
      <div
        className={`flex justify-center pb-7
    ${mode === "light" ? "text-slate-700" : "text-white"}`}
      >
        <div
          className={`w-[500px] max-w-full p-5 
        rounded-md shadow-md transition 
        flex flex-col items-center gap-7
         ${
           mode === "light"
             ? "shadow-gray-200 hover:shadow-gray-300"
             : " shadow-[#292929] hover:shadow-[#585858]"
         } `}
        >
          {transaction.category !== "transfer" && (
            <div
              style={{ backgroundColor: primaryLightColor }}
              className={`h-[40px] w-[40px] rounded-full 
              flex justify-center items-center text-white`}
            >
              {transaction.category === "money-received" && (
                <FaMoneyBillWave size={24} />
              )}

              {transaction.category === "deposit" && (
                <AiOutlineCreditCard size={24} />
              )}

              {transaction.category === "loan" && (
                <FaHandHoldingUsd size={24} />
              )}

              {transaction.category === "investment-topup" && (
                <IoIosArrowUp size={24} />
              )}

              {transaction.category === "investment-withdrawal" && (
                <IoIosArrowDown size={24} />
              )}
            </div>
          )}

          {transaction.category === "transfer" && (
            <Lottie animationData={sucessful} loop={false} />
          )}

          {/* {transaction.category === "deposit" &&
            (transaction.status === "action-needed" ||
              transaction.status === "processing" ||
              transaction.status === "rejected") && (
              <YouTube
                videoId="sMO-mU73L6g"
                iframeClassName="w-full"
                className="w-full"
                onError={() => toast.error("Unable to load video")}
                opts={{
                  height: "390",
                  playerVars: {
                    autoplay: 1,
                    controls: 1,
                  },
                }}
              />
            )} */}

          <div className="flex flex-col w-full">
            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>{transaction.title}:</div>
              <div>
                {currency}
                {formatNumber(transaction.amount)}
              </div>
            </div>

            {(transaction.pendingBalance ||
              transaction.pendingBalance === 0) && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Pending balance:</div>
                <div>
                  {currency}
                  {formatNumber(transaction.pendingBalance)}
                </div>
              </div>
            )}

            {transaction.senderName && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Sender:</div>
                <div>{transaction.senderName}</div>
              </div>
            )}

            {transaction.receiverName && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Receiver:</div>
                <div>{transaction.receiverName}</div>
              </div>
            )}

            {transaction.coinName && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Coin Name:</div>
                <div>{transaction.coinName || "BTC"}</div>
              </div>
            )}

            {transaction.walletAddress && (
              <>
                <div className="w-full flex justify-between items-center py-4">
                  <div>Wallet Address:</div>
                  <div className=" break-all">{transaction.walletAddress}</div>
                </div>
                {transaction.category !== "transfer" && (
                  <CopyButton value={transaction.walletAddress}>
                    {({ copied, copy }) => (
                      <Button
                        small
                        outline={copied ? false : true}
                        label={"Copy Wallet"}
                        onClick={() => {
                          copy();
                          toast.success("Wallet address copied");
                        }}
                        icon={FaCopy}
                      />
                    )}
                  </CopyButton>
                )}
              </>
            )}

            {transaction.receiverPaymentUsername && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Receiver&apos;s {transaction.paymentTitle} Username:</div>
                <div>{transaction.receiverPaymentUsername}</div>
              </div>
            )}

            {transaction.receiverEmail && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Receiver&apos;s email:</div>
                <div>{transaction.receiverEmail}</div>
              </div>
            )}

            {transaction.receiverPhoneNumber && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Receiver&apos;s Phone Number:</div>
                <div>{transaction.receiverPhoneNumber}</div>
              </div>
            )}

            {transaction.receiverAccountNumber && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Receiver&apos;s Account Number:</div>
                <div>{transaction.receiverAccountNumber}</div>
              </div>
            )}

            {transaction.status && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Status:</div>
                <div>{transaction.status}</div>
              </div>
            )}

            {(transaction.amountToDeposit ||
              transaction.amountToDeposit === 0) && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Amount to deposit:</div>
                <div>
                  {currency}
                  {formatNumber(transaction.amountToDeposit)}
                </div>
              </div>
            )}

            {showDepositedAmount && (
              <div className="w-full flex justify-between items-center py-4 ">
                <div>Deposited amount so far:</div>
                <div>
                  {currency}
                  {formatNumber(Number(transaction.despositedAmount))}
                </div>
              </div>
            )}

            {transaction.loanReason && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Loan Reason:</div>
                <div>{transaction.loanReason}</div>
              </div>
            )}

            {transaction.loanDuration && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Loan Duration:</div>
                <div>{transaction.loanDuration}</div>
              </div>
            )}
          </div>

          {transaction.category === "money-received" &&
            transaction.status === "pending" && (
              <div
                style={{ backgroundColor: primaryLightColor }}
                className={`w-full rounded-md p-2 text-white flex flex-col gap-5`}
              >
                <div className="w-full">
                  <Button
                    label="Make a deposit"
                    onClick={() => router.push("/add-money")}
                  />
                </div>
                <div>
                  <span className="font-semibold">Security Measure - </span>
                  Deposit {company?.transfer.percentToPay}% to Secure Pending
                  Transactions. The good news is that you don&apos;t need to
                  make the full payment at once! You can make a one-time deposit
                  of {currency}
                  {transaction.amountToDeposit} or you can make partial deposits
                  to your account till the payment is done.
                </div>

                {/* <div>
                  For example, if your pending transaction is {currency}3,500,
                  15% would be {currency}525. You can make partial payments,
                  like {currency}100, and a proportional amount of the pending
                  transaction - {currency}666.67, equivalent to {currency}100,
                  will enter your account balance. This way, you can securely
                  complete your transactions at your own pace.
                </div> */}

                <Button
                  outline
                  label="Click here for more details"
                  onClick={() => setShowWhyModal(true)}
                />
              </div>
            )}

          {transaction.category === "deposit" &&
            transaction.type === "manual-coin-payment" &&
            (transaction.status === "action-needed" ||
              transaction.status === "processing" ||
              transaction.status === "rejected") && (
              <div className="w-full flex flex-col gap-3">
                <ManualCoinPaymentTransaction transaction={transaction} />
              </div>
            )}

          {transaction.category === "deposit" &&
            transaction.type === "automatic-coin-payment" &&
            (transaction.status === "action-needed" ||
              transaction.status === "processing" ||
              transaction.status === "rejected") && (
              <div className="w-full flex flex-col gap-3">
                <AutomaticCoinPaymentTransaction transaction={transaction} />
              </div>
            )}

          {transaction.note && (
            <div
              className={`w-full rounded-md shadow-md 
            p-2
          ${
            mode === "light"
              ? "shadow-gray-200 hover:shadow-gray-300"
              : " shadow-[#292929] hover:shadow-[#585858]"
          }`}
            >
              Note : {transaction.note}
            </div>
          )}
        </div>
      </div>
      <WhyModal opened={showWhyModal} onClose={() => setShowWhyModal(false)} />
    </>
  );
};

export default TransactionInfo;
