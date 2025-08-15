import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import { isNumber } from "@/constants/isNumber";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface AddInvestmentBonusModalProps {
  opened: boolean;
  onClose: () => void;
  getInvestment: () => void;
  investment: InvestmentProps;
}

const AddInvestmentBonusModal = (props: AddInvestmentBonusModalProps) => {
  const { opened, onClose, getInvestment, investment } = props;
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    bonusTitle: "",
    bonusAmount: "",
    investmentId: investment._id,
  });

  const addBonusHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`/api/admin/investment/add-bonus`, data);
      if (res.data.error) throw new Error(res.data.error);
      onClose();
      getInvestment();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer title="Add Bonus" opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div>This is will be added to the user Profit balance</div>

        <div className="flex flex-col gap-1.5">
          <div>Bonus Title</div>
          <TextInput
            value={data.bonusTitle}
            onChange={(e) => setData({ ...data, bonusTitle: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div>Enter Bonus Amount</div>
          <TextInput
            value={data.bonusAmount}
            onChange={(e) => {
              isNumber(+e.target.value) &&
                setData({ ...data, bonusAmount: e.target.value });
            }}
          />
        </div>

        <div className="flex justify-between gap-3">
          <Button
            outline
            loading={loading}
            label="Add"
            onClick={addBonusHandler}
          />
          <Button label="Cancel" onClick={onClose} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default AddInvestmentBonusModal;
