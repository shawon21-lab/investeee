import Button from "@/components/Button";
import ModalContainer from "@/components/modals/ModalContainer";
import currencyData from "@/constants/currencyData";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  company: CompanyProps;
}

interface CurrencyDataType {
  name: string;
  code: string;
  symbol: string;
}

const CurrencySetupModal = (props: ModalProps) => {
  const { opened, onClose, company } = props;
  const [loading, setLoading] = useState(false);

  const [displayCurrency, setDisplayCurrency] = useState<CurrencyDataType[]>();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyDataType>();

  const primary = company.color.primary;
  const primaryVeryLight = company.color.primaryVeryLight;

  useEffect(() => {
    setDisplayCurrency(currencyData);
    setSelectedCurrency(company.currency);
  }, [company.currency]);

  const Handler = async () => {
    try {
      if (
        company.currency.code === selectedCurrency?.code &&
        company.currency.symbol === selectedCurrency.symbol
      )
        throw new Error("No Changes were made. Change currency and update");
      setLoading(true);
      const res = await axios.post(
        "/api/company/currency-setup",
        selectedCurrency
      );
      if (res.data.error) throw new Error(res.data.error);
      toast.success(res.data.message);
      onClose();
      location.reload();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer title="Currency Setup" opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-3 min-h-[230px] justify-between">
        <div className="w-full flex gap-1 flex-col">
          <div
            style={{ color: company.color.primaryLight }}
            className="text-lg font-bold"
          >
            Select Currency
          </div>

          <div className="w-full flex flex-col gap-3 max-h-[50vh] overflow-auto">
            {displayCurrency?.map((item) => {
              return (
                <div
                  onClick={() => setSelectedCurrency(item)}
                  style={{
                    borderColor: primaryVeryLight,
                    backgroundColor:
                      (selectedCurrency?.code === item.code &&
                        primary &&
                        selectedCurrency.symbol === item.symbol &&
                        primary) ||
                      undefined,
                  }}
                  key={item.code}
                  className="flex justify-between px-3 py-2.5 
                  rounded-md border sm:cursor-pointer items-center 
                  active:scale-95 transition-all"
                >
                  <div>{item.name}</div>
                  <div className="text-xs">{item.code}</div>
                  <div className="text-lg font-bold">{item.symbol}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <Button loading={loading} label="Update" onClick={Handler} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default CurrencySetupModal;
