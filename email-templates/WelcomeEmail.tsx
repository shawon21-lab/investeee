import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface PaywanderWelcomeEmail {
  userFirstname: string;
  company: CompanyProps;
}

export const WelcomeEmail = (props: PaywanderWelcomeEmail) => {
  const { userFirstname, company } = props;

  return (
    <Html>
      <Head />
      <Preview>{company?.welcomeEmail?.emailMessage}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Img
              style={{ margin: "0 auto" }}
              src={company?.logo?.url}
              width="auto"
              height="60"
              alt={company?.name}
            />
          </Section>
          <Text style={paragraph}>Hi {userFirstname},</Text>

          <Text style={paragraph}>{company?.welcomeEmail?.emailMessage}</Text>

          <Section style={btnContainer}>
            <Button
              pX={12}
              pY={12}
              style={{
                ...button,
                backgroundColor: company?.color?.primary,
              }}
              href={company?.baseUrl}
            >
              Get started
            </Button>
          </Section>
          <Text style={paragraph}>
            Best,
            <br />
            The {company?.name} team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>{company?.address}</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main = {
  backgroundColor: "#ffffff",
  padding: "10px",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  padding: 10,
  width: "100%",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
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

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
