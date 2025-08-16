"use client";
import Button from "@/components/Button";
import DeleteTransactionModal from "@/components/admin/transaction/DeleteTransactionModal";
import ApproveDepositModal from "@/components/admin/transaction/deposit/ApproveDepositModal";
import RejectTransactionModal from "@/components/admin/transaction/RejectTransactionModal";
import ApproveLoanModal from "@/components/admin/transaction/loan/ApproveLoanModal";
import ApproveTransferModal from "@/components/admin/transaction/transfer/ApproveTransferModal";
import useTheme from "@/components/hooks/useTheme";
import formatNumber from "@/constants/formatNumber";
import { Avatar, Loader } from "@mantine/core";
import axios from "axios";
import { CldImage } from "next-cloudinary";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdPayments } from "react-icons/md";
import useCompany from "@/components/hooks/useCompany";

const Page = () => {
  const { mode } = useTheme();
  const router = useRouter();
  const [transaction, setTransation] = useState<TransactionProps>();
  const showDepositedAmount =
    transaction &&
    (transaction.despositedAmount || transaction.despositedAmount === 0);
  const transactionId = useParams().transactionId;

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;
  const currency = company?.currency.symbol;

  const [modals, setModals] = useState({
    approveDeposit: false,
    approveTransfer: false,
    approveLoan: false,
    reject: false,
    delete: false,
  });

  const getTransaction = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/transactions/${transactionId}`);
      if (data.error) throw new Error(data.error);
      setTransation(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [transactionId]);

  useEffect(() => {
    if (transactionId) getTransaction();
  }, [getTransaction, transactionId]);

  if (!transaction)
    return (
      <div className="w-full flex justify-center">
        <Loader color={primaryLightColor} />
      </div>
    );

  return (
    <>
      <div className={`flex justify-center pb-7`}>
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
          <Avatar color="red" alt="its me" size="lg" radius="xl">
            <MdPayments color={primaryLightColor} />
          </Avatar>

          <div className="w-full flex items-center gap-3">
            <Button
              onClick={() => router.push(`/admin/users/${transaction.userId}`)}
              label={"Transaction Owner"}
            />

            {(transaction?.pendingBalance ||
              transaction.pendingBalance == 0) && (
              <Button onClick={() => {}} label={"Send Reminder Email"} />
            )}
          </div>

          <div className="flex flex-col w-full">
            {transaction && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>{transaction.title}:</div>
                <div>
                  {currency}
                  {formatNumber(transaction.amount)}
                </div>
              </div>
            )}

            {(transaction?.pendingBalance ||
              transaction.pendingBalance == 0) && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Pending balance:</div>
                <div>
                  {currency}
                  {formatNumber(transaction.pendingBalance)}
                </div>
              </div>
            )}

            {transaction?.senderName && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Sender:</div>
                <div>{transaction.senderName}</div>
              </div>
            )}

            {transaction?.walletAddress && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Wallet Address:</div>
                <div>{transaction.walletAddress}</div>
              </div>
            )}

            {transaction?.coinName && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Coin Name:</div>
                <div>{transaction.coinName}</div>
              </div>
            )}

            {transaction?.receiverName && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Receiver:</div>
                <div>{transaction.receiverName}</div>
              </div>
            )}

            {transaction?.receiverPaymentUsername && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Receiver&apos;s {transaction.paymentTitle} Username:</div>
                <div>{transaction.receiverPaymentUsername}</div>
              </div>
            )}

            {transaction?.receiverEmail && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Receiver&apos;s email:</div>
                <div>{transaction.receiverEmail}</div>
              </div>
            )}

            {transaction?.receiverPhoneNumber && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Receiver&apos;s Phone Number:</div>
                <div>{transaction.receiverPhoneNumber}</div>
              </div>
            )}

            {transaction?.receiverAccountNumber && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Receiver&apos;s Account Number:</div>
                <div>{transaction.receiverAccountNumber}</div>
              </div>
            )}

            {transaction?.status && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Status:</div>
                <div>{transaction.status}</div>
              </div>
            )}

            {(transaction?.amountToDeposit ||
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

            {transaction?.loanReason && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Loan Reason:</div>
                <div>{transaction.loanReason}</div>
              </div>
            )}

            {transaction?.loanDuration && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Loan Duration:</div>
                <div>{transaction.loanDuration}</div>
              </div>
            )}
          </div>

          {/* approving deposit */}
          {transaction?.category === "deposit" &&
            transaction?.status === "processing" && (
              <div className="w-full">
                <div>Approving deposit transaction</div>
                <div className="w-full flex justify-between gap-3 flex-col sm:flex-row">
                  <Button
                    label={"Approve Deposit"}
                    onClick={() =>
                      setModals({ ...modals, approveDeposit: true })
                    }
                  />
                  <Button
                    outline
                    label={"Reject Deposit"}
                    onClick={() => setModals({ ...modals, reject: true })}
                  />
                </div>
              </div>
            )}

          {/* approving external transfer */}
          {transaction?.category === "transfer" &&
            transaction?.status === "processing" && (
              <div className="w-full">
                <div>Approving external Transafer</div>
                <div className="w-full flex justify-between gap-3 flex-col sm:flex-row">
                  <Button
                    label={"Aprove"}
                    onClick={() =>
                      setModals({ ...modals, approveTransfer: true })
                    }
                  />
                  <Button
                    outline
                    label={"Reject"}
                    onClick={() => setModals({ ...modals, reject: true })}
                  />
                </div>
              </div>
            )}

          {/* approving loan */}
          {transaction?.category === "loan" &&
            transaction?.status === "processing" && (
              <div className="w-full">
                <div>Aproving Loan transactions</div>
                <div className="w-full flex justify-between gap-3 flex-col sm:flex-row">
                  <Button
                    label={"Aprove"}
                    onClick={() => setModals({ ...modals, approveLoan: true })}
                  />
                  <Button
                    outline
                    label={"Reject"}
                    onClick={() => setModals({ ...modals, reject: true })}
                  />
                </div>
              </div>
            )}

          {transaction.linkedTransactionId && (
            <Button
              onClick={() =>
                router.push(
                  `/admin/transactions/${transaction.linkedTransactionId}`
                )
              }
              label={"linked transaction"}
            />
          )}

          {transaction?.paymentProof && (
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

          {transaction?.note && (
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

          <div className="w-full">
            <div>Delete or edit this transaction</div>
            <div className="w-full flex justify-between gap-3 flex-col sm:flex-row">
              <Button
                label={"Delete"}
                onClick={() => setModals({ ...modals, delete: true })}
              />
              <Button disabled outline label={"Edit"} onClick={() => {}} />
            </div>
          </div>
        </div>
      </div>

      <ApproveDepositModal
        opened={modals.approveDeposit}
        transaction={transaction}
        onClose={() => setModals({ ...modals, approveDeposit: false })}
      />

      <RejectTransactionModal
        opened={modals.reject}
        transaction={transaction}
        onClose={() => setModals({ ...modals, reject: false })}
      />

      <ApproveTransferModal
        opened={modals.approveTransfer}
        transaction={transaction}
        onClose={() => setModals({ ...modals, approveTransfer: false })}
      />

      <ApproveLoanModal
        opened={modals.approveLoan}
        transaction={transaction}
        onClose={() => setModals({ ...modals, approveLoan: false })}
      />

      <DeleteTransactionModal
        opened={modals.delete}
        transaction={transaction}
        onClose={() => setModals({ ...modals, delete: false })}
      />
    </>
  );
};

export default Page;
