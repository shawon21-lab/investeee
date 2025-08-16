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
  planName: string;
  fullname: string;
  profitAmount: number;
  totalProfit: number;
  investmentId: string;
  company: CompanyProps;
}

export const ReturnsEmail = (props: TransactionInfoProp) => {
  const {
    planName,
    profitAmount,
    fullname,
    totalProfit,
    investmentId,
    company,
  } = props;

  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date());

  return (
    <Html>
      <Head />
      <Preview>{`New Return on your ${planName}`}</Preview>
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
              You have a new return in your {planName} investment
            </Heading>

            <Text style={paragraph}>
              Profit received:
              <b>
                {" "}
                {company.currency.symbol}
                {formatNumber(profitAmount || 0)}
              </b>
            </Text>

            <Text style={paragraph}>
              Plan Name:<b> {planName}</b>
            </Text>

            <Text style={paragraph}>
              Total Profit so far:
              <b>
                {" "}
                {company.currency.symbol}
                {totalProfit}
              </b>
            </Text>

            <Text style={paragraph}>
              Date:<b> {formattedDate}</b>
            </Text>
          </Section>

          <Section style={btnContainer}>
            <Button
              pX={12}
              pY={12}
              style={{ ...button, backgroundColor: company.color.primary }}
              href={`${company.baseUrl}/home/invest-and-earn/${investmentId}`}
            >
              View Details
            </Button>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>Thanks, {company.name} Finance Team</Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Text style={{ textAlign: "center", color: "#706a7b" }}>
            © {new Date().getFullYear()} {company.name}, All Rights Reserved{" "}
            <br />
            408 Warren Rd - San Mateo, CA 94402
          </Text>
        </Section>
      </Body>
    </Html>
  );
};

export default ReturnsEmail;

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
