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
  message: string;
  company: CompanyProps;
}

export const CustomEmail = (props: TwitchResetPasswordEmailProps) => {
  const { username, message, company } = props;
  const updatedDate = new Date();
  const paragraphs = message.split("|");

  return (
    <Html>
      <Head />
      <Preview>{message}</Preview>
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

            {paragraphs.map((para) => (
              <Text key={Math.random() + para} style={paragraph}>
                {para}
              </Text>
            ))}

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

export default CustomEmail;

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
