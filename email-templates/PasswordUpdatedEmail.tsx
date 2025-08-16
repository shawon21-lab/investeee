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
} from "@react-email/components";
import * as React from "react";

interface TwitchResetPasswordEmailProps {
  username: string;
  updatedDate: Date;
  company: CompanyProps;
}

export const PasswordUpdated = (props: TwitchResetPasswordEmailProps) => {
  const { username, updatedDate, company } = props;

  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(updatedDate);

  return (
    <Html>
      <Head />
      <Preview>
        You updated the password for your {company.name} account
      </Preview>
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
            <Text style={paragraph}>Hi {username},</Text>
            <Text style={paragraph}>
              You updated the password for your {company.name} account on{" "}
              {formattedDate}. If this was you, then no further action is
              required.
            </Text>
            <Text style={paragraph}>
              However if you did NOT perform this password change, please
              <Link href={`${company.baseUrl}/forgot-password`} style={link}>
                {" "}
                reset your account password
              </Link>{" "}
              immediately.
            </Text>
            <Text style={paragraph}>
              Remember to use a password that is both strong and unique to your
              {company.name} account. To learn more about how to create a strong
              and unique password,
              <Link href={company.baseUrl} style={link}>
                {" "}
                click here.
              </Link>
            </Text>
            <Text style={paragraph}>
              Still have questions? Please contact
              <Link href={company.baseUrl} style={link}>
                {" "}
                {company.name} Support
              </Link>
            </Text>
            <Text style={paragraph}>
              Thanks,
              <br />
              {company.name} Support Team
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          {/* <Row>
            <Column align="right" style={{ width: "50%", paddingRight: "8px" }}>
              <Img src={`${baseUrl}/static/twitch-icon-twitter.png`} />
            </Column>
            <Column align="left" style={{ width: "50%", paddingLeft: "8px" }}>
              <Img src={`${baseUrl}/static/twitch-icon-facebook.png`} />
            </Column>
          </Row> */}
          <Text style={{ textAlign: "center", color: "#706a7b" }}>
            © {updatedDate?.getFullYear()} {company.name}, All Rights Reserved{" "}
            <br />
            408 Warren Rd - San Mateo, CA 94402
          </Text>
        </Section>
      </Body>
    </Html>
  );
};

export default PasswordUpdated;

const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";

const main = {
  backgroundColor: "#efeef1",
  fontFamily,
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

const link = {
  textDecoration: "underline",
};
