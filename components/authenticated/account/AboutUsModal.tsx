"use client";
import Button from "@/components/Button";
import ModalContainer from "@/components/modals/ModalContainer";
import React from "react";
import { useMediaQuery } from "@mantine/hooks";
import AboutUsContent from "@/constants/aboutUsContent";

interface AboutUsModalProps {
  opened: boolean;
  onClose: () => void;
}

const Paragraph = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="font-bold text-slate-500 text-lg">{title}</div>
      <div>{content}</div>
    </div>
  );
};

const AboutUsModal = (props: AboutUsModalProps) => {
  const { opened, onClose } = props;
  const isMobile = useMediaQuery("(max-width: 50em)");

  return (
    <ModalContainer
      fullScreen={isMobile}
      title="About Us"
      opened={opened}
      onClose={onClose}
      size="lg"
    >
      <div className={`w-full  rounded-md p-2 pb-5  flex flex-col gap-5`}>
        {AboutUsContent.map((item) => (
          <Paragraph
            key={item.content}
            title={item.title}
            content={item.content}
          />
        ))}
        <Button onClick={onClose} label="CLose" />
      </div>
    </ModalContainer>
  );
};

export default AboutUsModal;
