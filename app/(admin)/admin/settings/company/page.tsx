"use client";

import ColorSetupModal from "@/components/admin/settings/company/ColorSetupModal";
import CompanyInfoModal from "@/components/admin/settings/company/CompanyInfoModal";
import CurrencySetupModal from "@/components/admin/settings/company/CurrencySetup";
import DepositSetupModal from "@/components/admin/settings/company/DepositSetupModal";
import EmailSetupModal from "@/components/admin/settings/company/EmailSetupModal";
import LoanSetupModal from "@/components/admin/settings/company/LoanSetupModal";
import LogoSetup from "@/components/admin/settings/company/LogoSetup";
import NowPaymentModal from "@/components/admin/settings/company/NowPaymentModal";
import PaymentSetupModal from "@/components/admin/settings/company/PaymentSetupModal";
import SettingsCard from "@/components/admin/settings/company/SettingsCard";
import SignupBonusModal from "@/components/admin/settings/company/SignupBonusSetup";
import TransferSetupModal from "@/components/admin/settings/company/TransferSetupModal";
import WelcomeEmailSetupModal from "@/components/admin/settings/company/WelcomeEmailSetup";
import WithdrawSetupModal from "@/components/admin/settings/company/WithdrawSetupModal";
import useCompany from "@/components/hooks/useCompany";
import { Loader } from "@mantine/core";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BiMoney, BiMoneyWithdraw } from "react-icons/bi";
import {
  FaBone,
  FaBuilding,
  FaEnvelope,
  FaHandHoldingUsd,
  FaMoneyBill,
  FaMoneyCheck,
  FaMoneyCheckAlt,
  FaPalette,
  FaPaperPlane,
  FaPlane,
} from "react-icons/fa";
import { MdCurrencyExchange, MdEmail } from "react-icons/md";

const Page = () => {
  // const [company, setCompany] = useState<CompanyProps>();
  const [companyInfoModal, setCompanyInfoModal] = useState(false);
  const [nowpaymentModal, setNowpaymentModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [signupBonusModal, setSignupBonusModal] = useState(false);
  const [loanModal, setLoanModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [colorModal, setColorModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [currencyModal, setCurrencyModal] = useState(false);
  const [welcomeEmailModal, setWelcomeEmailModal] = useState(false);
  const { company } = useCompany();

  const primaryLightColor = company?.color.primaryLight;

  if (!company) {
    return (
      <div className="flex w-full justify-center">
        <Loader color={primaryLightColor} />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col w-full gap-7 pb-10">
        <div
          className={`text-xl sm:text-2xl font-bold 
        flex justify-center`}
        >
          Company Settings
        </div>

        <div className="flex justify-center">
          <LogoSetup company={company} />
        </div>

        <div
          className="flex flex-col gap-3 overflow-auto 
        max-h-[70vh] pb-5 pt-2"
        >
          <SettingsCard
            onClick={() => setCompanyInfoModal(true)}
            label="Edit Company Info"
            icon={FaBuilding}
          />

          <SettingsCard
            onClick={() => setWelcomeEmailModal(true)}
            label="Welcome Email Setup"
            icon={FaEnvelope}
          />

          <SettingsCard
            onClick={() => setNowpaymentModal(true)}
            label="Add/Edit NowPayment API"
            icon={FaMoneyBill}
          />

          <SettingsCard
            onClick={() => setTransferModal(true)}
            label="SetUp Transfer Options"
            icon={FaPaperPlane}
          />

          <SettingsCard
            onClick={() => setDepositModal(true)}
            label="SetUp Deposit Options"
            icon={BiMoney}
          />

          <SettingsCard
            onClick={() => setCurrencyModal(true)}
            label="Setup Currency"
            icon={MdCurrencyExchange}
          />

          <SettingsCard
            onClick={() => setWithdrawModal(true)}
            label="SetUp Withdraw Options"
            icon={BiMoneyWithdraw}
          />

          <SettingsCard
            onClick={() => setSignupBonusModal(true)}
            label="Setup Signup bonus"
            icon={FaMoneyCheck}
          />

          <SettingsCard
            onClick={() => setLoanModal(true)}
            label="Loan Options"
            icon={FaHandHoldingUsd}
          />

          <SettingsCard
            onClick={() => setPaymentModal(true)}
            label="SetUp For Payment Options"
            icon={FaMoneyCheckAlt}
          />

          <SettingsCard
            onClick={() => setColorModal(true)}
            label="Change Website Color"
            icon={FaPalette}
          />

          <SettingsCard
            onClick={() => setEmailModal(true)}
            label="Email Setup"
            icon={MdEmail}
          />
        </div>
      </div>

      <CompanyInfoModal
        opened={companyInfoModal}
        onClose={() => setCompanyInfoModal(false)}
        company={company}
      />

      <WelcomeEmailSetupModal
        opened={welcomeEmailModal}
        onClose={() => setWelcomeEmailModal(false)}
        company={company}
      />

      <NowPaymentModal
        opened={nowpaymentModal}
        onClose={() => setNowpaymentModal(false)}
        company={company}
      />

      <TransferSetupModal
        opened={transferModal}
        onClose={() => setTransferModal(false)}
        company={company}
      />

      <DepositSetupModal
        opened={depositModal}
        onClose={() => setDepositModal(false)}
        company={company}
      />

      <CurrencySetupModal
        opened={currencyModal}
        onClose={() => setCurrencyModal(false)}
        company={company}
      />

      <WithdrawSetupModal
        opened={withdrawModal}
        onClose={() => setWithdrawModal(false)}
        company={company}
      />

      <SignupBonusModal
        opened={signupBonusModal}
        onClose={() => setSignupBonusModal(false)}
        company={company}
      />

      <LoanSetupModal
        opened={loanModal}
        onClose={() => setLoanModal(false)}
        company={company}
      />

      <PaymentSetupModal
        opened={paymentModal}
        onClose={() => setPaymentModal(false)}
        company={company}
      />

      <ColorSetupModal
        opened={colorModal}
        onClose={() => setColorModal(false)}
        company={company}
      />

      <EmailSetupModal
        opened={emailModal}
        onClose={() => setEmailModal(false)}
        company={company}
      />
    </>
  );
};

export default Page;
