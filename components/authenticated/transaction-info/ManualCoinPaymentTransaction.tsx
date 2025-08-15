"use client";

import "animate.css";
import React, { useCallback, useEffect, useState } from "react";
import Button from "@/components/Button";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { toast } from "react-hot-toast";
import axios from "axios";
import QRCode from "react-qr-code";
import { Loader } from "@mantine/core";
import useCompany from "@/components/hooks/useCompany";

interface ManualCoinPaymentTransationProp {
  transaction: TransactionProps;
}

const ManualCoinPaymentTransaction = (
  props: ManualCoinPaymentTransationProp
) => {
  const { transaction } = props;
  const [loading, setLoading] = useState(false);
  const [loadingEstimated, setLoadingEstimated] = useState(false);
  const [estimatedAmount, setEstimatedAmount] = useState<number | undefined>();

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;
  const primaryVeryLightColor = company?.color.primaryVeryLight;

  const currency = company?.currency.code;

  const uploadPaymentHandler = async (result: any, widget: any) => {
    try {
      widget.close();
      setLoading(true);
      const {
        public_id,
        url,
        secure_url,
        format,
        width,
        height,
        bytes,
        original_filename,
        created_at,
        etag,
        thumbnail_url,
      } = result.info;

      const { data } = await axios.post("/api/transactions/upload-payment", {
        public_id,
        url,
        secure_url,
        format,
        width,
        height,
        bytes,
        original_filename,
        created_at,
        etag,
        thumbnail_url,
        transactionId: transaction._id,
      });

      if (data.error) throw new Error(data.error);
      toast.success("Your proof is now being reviewed");
      setTimeout(() => {
        location.reload();
      }, 2000);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getEstimatedAmount = useCallback(async () => {
    try {
      setLoadingEstimated(true);
      const { data } = await axios.get(
        `https://api.nowpayments.io/v1/estimate?amount=${transaction.amount}&currency_from=${currency}&currency_to=${transaction.coinName}`,
        { headers: { "x-api-key": company?.nowPaymentApi } }
      );
      setEstimatedAmount(data.estimated_amount);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingEstimated(false);
    }
  }, [
    company?.nowPaymentApi,
    currency,
    transaction.amount,
    transaction.coinName,
  ]);

  useEffect(() => {
    getEstimatedAmount();
  }, [getEstimatedAmount]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-5 items-center">
        {transaction.walletAddress && estimatedAmount && !loadingEstimated && (
          <div
            style={{ backgroundColor: primaryVeryLightColor }}
            className="h-auto w-full max-w-[200px] 
       p-[10px] my-0 mx-auto 
      rounded-xl"
          >
            <div className="text-black">
              Pay Exactly <br /> {estimatedAmount} {transaction.coinName}
            </div>

            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={`${transaction.coinName}:${transaction.walletAddress}?amount=${estimatedAmount}`}
              viewBox={`0 0 256 256`}
            />
          </div>
        )}

        {loadingEstimated && <Loader color={primaryLightColor} />}

        <div className="w-full flex items-center flex-col gap-2">
          <div>
            {transaction.paymentProof
              ? "You have uploaded a proof of payment. You can click on the button below to change the image if you uploaded the wrong one."
              : ` Scan QR Code or Copy wallet address. Once you are done with the deposit, upload a screen shot of the transaction or
                      any evidence of the payment. Our team will verify it under
                      24hrs`}
          </div>
          {transaction.paymentProof && (
            <CldImage
              width={transaction.paymentProof.width}
              height={transaction.paymentProof.height}
              alt={transaction.paymentProof.original_filename}
              src={transaction.paymentProof.public_id}
              onError={(event) => {
                console.log(event);
                toast.error(
                  "seems somthings went wrong getting your image. Upload new one or try reloading the page"
                );
              }}
            />
          )}
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET || ""}
            onUpload={uploadPaymentHandler}
          >
            {({ open }) => (
              <Button
                loading={loading}
                onClick={(e) => {
                  e.preventDefault();
                  open();
                }}
                label={
                  transaction.paymentProof
                    ? "Change Image"
                    : "Upload Payment Proof"
                }
              />
            )}
          </CldUploadWidget>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div>Don&apos;t have a wallet?</div>

        <a
          className="animate__animated animate__headShake animate__infinite	infinite animate__fast"
          href="https://global.transak.com/"
          target="_blank"
        >
          <Button outline label={"Buy Coin"} onClick={() => {}} />
        </a>
      </div>
    </>
  );
};

export default ManualCoinPaymentTransaction;
