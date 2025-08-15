"use client";

import "animate.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
// import { CldImage, CldUploadWidget } from "next-cloudinary";
import { toast } from "react-hot-toast";
import axios from "axios";
import QRCode from "react-qr-code";
import { CopyButton, Loader } from "@mantine/core";
import { useRouter } from "next/navigation";
import { FaCopy } from "react-icons/fa";
import useCompany from "@/components/hooks/useCompany";
import formatDate from "@/constants/formatDate";

interface AutomaticCoinPaymentTransationProp {
  transaction: TransactionProps;
}

const AutomaticCoinPaymentTransaction = (
  props: AutomaticCoinPaymentTransationProp
) => {
  const { transaction } = props;
  const router = useRouter();

  // const validUntil = Date.parse(
  //   `${transaction.automaticCoinPayment?.valid_until}`
  // );
  // const now = Date.now();

  // const minutesExpiresIn = validUntil - now;
  // const exactMinutes = minutesExpiresIn / 60000;
  // const [min, sec] = exactMinutes.toFixed(2).toString().split(".");
  // const minutes = Number(min);
  // const seconds = Number(((Number(sec) / 100) * 60).toFixed(0));

  // const [displaySec, setDisplaySec] = useState<number>(seconds);
  // const [displayMin, setDisplayMin] = useState<number>(minutes);
  // const [isEpired, setIsExpired] = useState(displayMin < 0);

  // const timerRef = useRef<number | null>(null);

  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const { company } = useCompany();
  const primaryVeryLightColor = company?.color.primaryVeryLight;

  const isEpired =
    paymentStatus === "failed" ||
    paymentStatus === "refunded" ||
    paymentStatus === "expired";

  const paymentConfirmed =
    paymentStatus === "confirmed" ||
    paymentStatus === "sending" ||
    paymentStatus === "finished";

  const validUntill = new Date(
    `${transaction.automaticCoinPayment?.valid_until}`
  );

  // const currency = company?.currency.code;

  const getPaymentStatus = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://api.nowpayments.io/v1/payment/${transaction.automaticCoinPayment?.payment_id}`,

        {
          headers: { "x-api-key": company?.nowPaymentApi },
        }
      );
      setPaymentStatus(data.payment_status);

      if (transaction.status === "action-needed") {
        console.log(data);
        if (paymentConfirmed) {
          const res = await axios.patch(
            `/api/admin/transactions/deposit/approve/automatic-coin-payment/${transaction._id}`
          );
          if (res.data.error) throw new Error(res.data.error);
          location.reload();
        } else if (isEpired) {
          const res = await axios.post(
            "/api/admin/transactions/reject/automatic-coin-payment",
            {
              transactionId: transaction._id,
              note: "Somthing may have went wrong with the payment or it expired",
            }
          );
          if (res.data.error) throw new Error(res.data.error);
          location.reload();
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [
    transaction._id,
    transaction.automaticCoinPayment?.payment_id,
    transaction.status,
    company?.nowPaymentApi,
    isEpired,
    paymentConfirmed,
  ]);

  useEffect(() => {
    getPaymentStatus();
  }, [getPaymentStatus]);

  // useEffect(() => {
  //   if (!isEpired) {
  //     timerRef.current = window.setInterval(() => {
  //       if (displayMin < 0) {
  //         // Timer has reached 0:00
  //         clearInterval(timerRef.current as number);
  //       } else if (displaySec === 0) {
  //         getPaymentStatus();
  //         setDisplaySec(59);
  //         setDisplayMin((prevMin) => prevMin - 1);
  //       } else {
  //         setDisplaySec((prevSec) => prevSec - 1);
  //       }
  //     }, 1000);
  //   }
  //   // Clear the interval when the component unmounts
  //   return () => clearInterval(timerRef.current as number);
  // }, [displayMin, displaySec, getPaymentStatus, isEpired, minutes, seconds]);

  return (
    <div className="flex flex-col gap-5">
      {!isEpired && <div>Scan QR code or Copy Wallet address</div>}

      {!isEpired && (
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          <div
            style={{ backgroundColor: primaryVeryLightColor }}
            className="h-auto w-full max-w-[200px] p-[10px] 
            my-0 mx-auto rounded-xl"
          >
            <div className="text-black">
              Pay Exactly <br />{" "}
              <span className="font-bold">
                {" "}
                {transaction.automaticCoinPayment?.pay_amount}{" "}
              </span>{" "}
              {transaction.coinName}
            </div>

            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={`${transaction.automaticCoinPayment?.pay_currency}:${transaction.automaticCoinPayment?.pay_address}?amount=${transaction.automaticCoinPayment?.pay_amount}`}
              viewBox={`0 0 256 256`}
            />
          </div>

          <div className="w-full flex items-start flex-col gap-2">
            <div className="flex items-center gap-2">
              <div>Payment Status:</div>
              <div>{paymentStatus}</div>
            </div>

            <div>
              Payment valid Untill {formatDate(validUntill)}
              {/* <span className="font-bold">
                {displayMin}min {displaySec}sec
              </span> */}
            </div>

            <div className="flex flex-col items-start gap-2">
              <div>
                Wallet({transaction.automaticCoinPayment?.pay_currency}):
              </div>
              <div className="break-all">
                {transaction.automaticCoinPayment?.pay_address}
              </div>
            </div>

            {transaction.automaticCoinPayment?.pay_address && (
              <CopyButton value={transaction.automaticCoinPayment.pay_address}>
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
          </div>
        </div>
      )}

      {isEpired && (
        <div className="flex items-center gap-2">
          <div>Payment Status:</div>
          <div>{paymentStatus}</div>
        </div>
      )}

      <div className="flex items-center gap-3">{loading && <Loader />}</div>

      {isEpired ? (
        <Button label="New Deposit" onClick={() => router.push("/add-money")} />
      ) : (
        <div className="flex flex-col gap-1">
          <div>Don&apos;t have a wallet? </div>

          <a
            className="animate__animated animate__headShake animate__infinite	infinite animate__fast"
            href="https://global.transak.com/"
            target="_blank"
          >
            <Button outline label={"Buy Coin"} onClick={() => {}} />
          </a>
        </div>
      )}
    </div>
  );
};

export default AutomaticCoinPaymentTransaction;
