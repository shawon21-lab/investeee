import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  userFirstname: string;
  resetPasswordCode: string;
  company: CompanyProps;
}

export const ResetPasswordEmail = (props: ResetPasswordEmailProps) => {
  const { userFirstname, resetPasswordCode, company } = props;

  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
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

          <Section>
            <Text style={text}>Hi {userFirstname},</Text>

            <Text style={text}>
              Someone recently requested a password change for your{" "}
              {company.name}
              account. If this was you, you can copy the code:
            </Text>

            <Section style={codeBox}>
              <Text style={confirmationCodeText}>{resetPasswordCode}</Text>
              <Text style={expireText}>Code will expire in one hour</Text>
            </Section>

            <Text style={text}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>

            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email
              to anyone. Contact us for{" "}
              <Link style={anchor} href={company.baseUrl}>
                any assistant.
              </Link>
            </Text>

            <Text style={text}>Have a nice Day!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "27px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const expireText = {
  textAlign: "center" as const,
  color: "#f43f5e",
  fontWeight: 500,
};

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginRight: "50px",
  marginBottom: "30px",
  padding: "43px 23px",
};

const confirmationCodeText = {
  fontSize: "30px",
  textAlign: "center" as const,
  verticalAlign: "middle",
};
const logo = {
  padding: 10,
  width: "100%",
};

const anchor = {
  textDecoration: "underline",
};
