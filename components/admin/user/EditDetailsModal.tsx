import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface EditDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  user: userSchemaType;
}

const EditDetailsModal = (props: EditDetailsModalProps) => {
  const { opened, onClose, user } = props;
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: "",
    username: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    country: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    setInput({
      fullname: user.fullname || "",
      username: user.username || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      dateOfBirth: user.dateOfBirth || "",
      country: user.country || "",
      city: user.city || "",
      address: user.address || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/admin/users/edit-details", {
        ...input,
        userId: user._id,
      });
      if (data.error) throw new Error(data.error);
      toast.success("Details Updated");
      location.reload();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer title="Edit Details" opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <TextInput
            value={input.fullname}
            onChange={(e) => setInput({ ...input, fullname: e.target.value })}
            placeholder="Full Name"
          />

          <TextInput
            value={input.username}
            onChange={(e) => setInput({ ...input, username: e.target.value })}
            placeholder="Username"
          />

          <TextInput
            value={input.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
            placeholder="Email"
          />

          <TextInput
            value={input.phoneNumber}
            onChange={(e) =>
              setInput({ ...input, phoneNumber: e.target.value })
            }
            placeholder="Phone Number"
          />

          <TextInput
            value={input.dateOfBirth}
            onChange={(e) =>
              setInput({ ...input, dateOfBirth: e.target.value })
            }
            placeholder="Date Of Birth"
          />

          <TextInput
            value={input.country}
            onChange={(e) => setInput({ ...input, country: e.target.value })}
            placeholder="Country"
          />

          <TextInput
            value={input.city}
            onChange={(e) => setInput({ ...input, city: e.target.value })}
            placeholder="City"
          />

          <TextInput
            value={input.address}
            onChange={(e) => setInput({ ...input, address: e.target.value })}
            placeholder="Address"
          />
        </div>
        <Button loading={loading} label="Top Up" onClick={handler} />
      </div>
    </ModalContainer>
  );
};

export default EditDetailsModal;
