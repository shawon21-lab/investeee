// import formatNumber from "@/constants/formatNumber";
import formatNumber from "../constants/formatNumber";
import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Heading,
  Button,
} from "@react-email/components";
import * as React from "react";

interface TransactionInfoProp {
  transaction?: TransactionProps;
  description?: string;
  fullname?: string;
  company: CompanyProps;
}

export const TransactionEmail = (props: TransactionInfoProp) => {
  const { transaction, description, fullname, company } = props;

  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(transaction?.createdAt);

  if (!transaction)
    return (
      <Html>
        <Head />
        <Preview>No Transaction</Preview>
        <Body style={main}>Nothing to see here</Body>
      </Html>
    );

  return (
    <Html>
      <Head />
      <Preview>{transaction?.title || "New Transaction"}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Img
              style={{ margin: "0 auto" }}
              src={company.logo.url}
              width="auto"
              height="60"
              alt={company.name}
            />
          </Section>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>
          <Section style={content}>
            <Heading style={heading}>Dear {fullname},</Heading>

            <Heading
              style={{ ...subHeading, color: company.color.primaryVeryLight }}
            >
              {description}
            </Heading>

            <Text style={paragraph}>
              {transaction.title}:
              <b>
                {" "}
                {company.currency.symbol}
                {formatNumber(transaction.amount)}
              </b>
            </Text>

            {(transaction.pendingBalance ||
              transaction.pendingBalance === 0) && (
              <Text style={paragraph}>
                Pending balance:
                <b>
                  {" "}
                  {company.currency.symbol}
                  {formatNumber(transaction.pendingBalance)}
                </b>
              </Text>
            )}

            {transaction.senderName && (
              <Text style={paragraph}>
                Sender:<b> {transaction.senderName}</b>
              </Text>
            )}

            {transaction.receiverName && (
              <Text style={paragraph}>
                Reciever:<b> {transaction.receiverName}</b>
              </Text>
            )}

            {transaction.coinName && (
              <Text style={paragraph}>
                Coin Name:<b> {transaction.coinName}</b>
              </Text>
            )}

            {transaction.walletAddress && (
              <Text style={paragraph}>
                Wallet Address:<b> {transaction.walletAddress}</b>
              </Text>
            )}

            {transaction.receiverPaymentUsername && (
              <Text style={paragraph}>
                Receiver&apos;s {transaction.paymentTitle} Username:
                <b> {transaction.receiverPaymentUsername}</b>
              </Text>
            )}

            {transaction.receiverEmail && (
              <Text style={paragraph}>
                Receiver&apos;s email<b> {transaction.receiverEmail}</b>
              </Text>
            )}

            {transaction.receiverPhoneNumber && (
              <Text style={paragraph}>
                Receiver&apos;s Phone Number:
                <b> {transaction.receiverPhoneNumber}</b>
              </Text>
            )}

            {transaction.receiverAccountNumber && (
              <Text style={paragraph}>
                Receiver&apos;s Account Number:
                <b> {transaction.receiverAccountNumber}</b>
              </Text>
            )}

            {transaction.status && (
              <Text style={paragraph}>
                Status:<b> {transaction.status}</b>
              </Text>
            )}

            {transaction.amountToDeposit && (
              <Text style={paragraph}>
                Amount to deposit:
                <b>
                  {" "}
                  {company.currency.symbol}
                  {formatNumber(transaction.amountToDeposit)}
                </b>
              </Text>
            )}

            {(transaction.despositedAmount ||
              transaction.despositedAmount === 0) && (
              <Text style={paragraph}>
                Deposited amount so far:
                <b>
                  {" "}
                  {company.currency.symbol}
                  {formatNumber(transaction.despositedAmount)}
                </b>
              </Text>
            )}

            {transaction.loanReason && (
              <Text style={paragraph}>
                Loan Reason:<b> {transaction.loanReason}</b>
              </Text>
            )}

            {transaction.loanDuration && (
              <Text style={paragraph}>
                Loan Duration:<b> {transaction.loanDuration}</b>
              </Text>
            )}

            <Text style={paragraph}>
              Initial Date:<b> {formattedDate}</b>
            </Text>
          </Section>

          <Section style={btnContainer}>
            {transaction.category === "money-received" &&
              transaction.status === "pending" &&
              transaction.amountToDeposit && (
                <Text style={{ ...paragraph, padding: "0px 10px 0px 10px" }}>
                  First, you need to make a deposit of{" "}
                  <b>
                    {company.currency.symbol}
                    {formatNumber(transaction.amountToDeposit)}
                  </b>{" "}
                  into your
                  {company.name} account. If you&apos;re confused on why you
                  should deposit{" "}
                  <b>
                    {company.currency.symbol}
                    {formatNumber(transaction.amountToDeposit)}
                  </b>
                  , click on the button below to view full details.
                </Text>
              )}

            {transaction.category === "deposit" &&
              transaction.type === "manual-coin-payment" &&
              (transaction.status === "action-needed" ||
                transaction.status === "processing" ||
                transaction.status === "rejected") && (
                <Text style={{ ...paragraph, padding: "0px 10px 0px 10px" }}>
                  Remember to Upload the Proof of payment after deposit. Click
                  on the button below for more details.
                </Text>
              )}

            <Button
              pX={12}
              pY={12}
              style={{ ...button, backgroundColor: company.color.primary }}
              href={`${company.baseUrl}/transaction-info/${transaction._id}`}
            >
              View Transaction
            </Button>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>Thanks, {company.name} Finance Team</Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Text style={{ textAlign: "center", color: "#706a7b" }}>
            © {transaction?.createdAt?.getFullYear()} {company.name}, All Rights
            Reserved <br />
            408 Warren Rd - San Mateo, CA 94402
          </Text>
        </Section>
      </Body>
    </Html>
  );
};

export default TransactionEmail;

const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";

const main = {
  backgroundColor: "#efeef1",
  fontFamily,
};

const heading = {
  fontSize: 25,
  fontWeight: "bold",
  textAlign: "center" as const,
  padding: "10px 0 10px 0",
};

const subHeading = {
  fontSize: 15,
  fontWeight: "bold",
  textAlign: "center" as const,
  padding: "10px 5px 10px 5px",
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};

const container = {
  width: "580px",
  margin: "30px auto",
  backgroundColor: "#ffffff",
};

const footer = {
  width: "580px",
  margin: "0 auto",
};

const content = {
  padding: "5px 25px 10px 25px",
};

const logo = {
  padding: 10,
  width: "100%",
};

const sectionsBorders = {
  width: "100%",
  display: "flex",
};

const sectionBorder = {
  borderBottom: "1px solid rgb(238,238,238)",
  width: "249px",
};

const sectionCenter = {
  borderBottom: "1px solid #f43f5e",
  width: "102px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
};

const link = {
  textDecoration: "underline",
};
