"use client";

import Button from "@/components/Button";
import ChangeUserRoleModal from "@/components/admin/user/ChangeUserRoleModal";
import ChangeUserStatusModal from "@/components/admin/user/ChangeUserStatusModal";
import DeleteUserModal from "@/components/admin/user/DeleteUserModal";
import EditBalanceModal from "@/components/admin/user/EditBalanceModal";
import EditDetailsModal from "@/components/admin/user/EditDetailsModal";
import ResetPasswordModal from "@/components/admin/user/ResetPasswordModal";
import SendEmailModal from "@/components/admin/user/SendEmailModal";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import formatNumber from "@/constants/formatNumber";
import { Avatar, Loader } from "@mantine/core";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { IoMdPerson } from "react-icons/io";

const Page = () => {
  const { mode } = useTheme();
  const userId = useParams().userId;
  const [user, setUser] = useState<userSchemaType>();
  const router = useRouter();

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;
  const currency = company?.currency.symbol;

  const [modals, setModals] = useState({
    editDetails: false,
    editBalance: false,
    deleteUser: false,
    sendEmail: false,
    resetPassword: false,
    userRole: false,
    userStatus: false,
  });

  const getUser = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/users/${userId}`);
      if (data.error) throw new Error(data.error);
      setUser(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) getUser();
  }, [getUser, userId]);

  if (!user)
    return (
      <div className="w-full flex justify-center">
        <Loader color={primaryLightColor} />
      </div>
    );

  return (
    <>
      <div className={`flex justify-center pb-7`}>
        <div
          className={`w-[600px] max-w-full p-5 
        rounded-md shadow-md transition 
        flex flex-col items-center gap-7
         ${
           mode === "light"
             ? "shadow-gray-200 hover:shadow-gray-300"
             : " shadow-[#292929] hover:shadow-[#585858]"
         } `}
        >
          <div>
            {user.avatar && (
              <Avatar
                src={user.avatar.url}
                alt="its me"
                size="xl"
                radius="md"
              />
            )}

            {!user.avatar && (
              <Avatar color="red" alt="its me" size="xl" radius="xl">
                <IoMdPerson color={primaryLightColor} />
              </Avatar>
            )}
          </div>

          <div className="w-full flex items-center gap-3">
            <Button
              onClick={() => setModals({ ...modals, sendEmail: true })}
              label={"Send Email"}
            />
            <Button
              onClick={() => router.push(`/admin/users/${userId}/transactions`)}
              label={"User Transactions"}
            />
          </div>

          <div className="flex flex-col w-full">
            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Fullname:</div>
              <div>{user.fullname}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Username:</div>
              <div>{user.username}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Email:</div>
              <div>{user.email}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Role:</div>
              <div>{user.role}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Manager:</div>
              <div>{user.manager.toUpperCase()}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Status:</div>
              <div>{user.status}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Account Balance:</div>
              <div>
                {currency}
                {formatNumber(user.accountBalance)}
              </div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Withdrawable Invest Balance:</div>
              <div>
                {currency}
                {formatNumber(user.investWithdrawableBalance)}
              </div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Loan Balance:</div>
              <div>
                {currency}
                {formatNumber(user.loanBalance)}
              </div>
            </div>

            {user.phoneNumber && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Phone Number:</div>
                <div>{user.phoneNumber}</div>
              </div>
            )}

            {user.dateOfBirth && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Date Of Birth:</div>
                <div>{user.dateOfBirth}</div>
              </div>
            )}

            {user.country && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Country:</div>
                <div>{user.country}</div>
              </div>
            )}

            {user.city && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>City:</div>
                <div>{user.city}</div>
              </div>
            )}

            {user.address && (
              <div className="w-full flex justify-between items-center py-4 border-b">
                <div>Address:</div>
                <div>{user.address}</div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row w-full gap-3">
            <Button
              onClick={() => setModals({ ...modals, editDetails: true })}
              outline
              label={"Edit Details"}
            />
            <Button
              onClick={() => setModals({ ...modals, editBalance: true })}
              label={"Edit Balance"}
            />
          </div>

          <div className="flex flex-col sm:flex-row w-full gap-3">
            <Button
              onClick={() => setModals({ ...modals, deleteUser: true })}
              label={"Delete User"}
            />

            <Button
              outline
              onClick={() => setModals({ ...modals, resetPassword: true })}
              label={"Reset Password"}
            />
          </div>

          <div className="flex flex-col sm:flex-row w-full gap-3">
            <Button
              outline
              onClick={() => setModals({ ...modals, userStatus: true })}
              label={"Block/Activate User"}
            />

            <Button
              onClick={() => setModals({ ...modals, userRole: true })}
              label={"Change User Role"}
            />
          </div>
        </div>
      </div>

      <EditDetailsModal
        user={user}
        opened={modals.editDetails}
        onClose={() => setModals({ ...modals, editDetails: false })}
      />
      <EditBalanceModal
        user={user}
        opened={modals.editBalance}
        onClose={() => setModals({ ...modals, editBalance: false })}
      />
      <DeleteUserModal
        user={user}
        opened={modals.deleteUser}
        onClose={() => setModals({ ...modals, deleteUser: false })}
      />

      <ResetPasswordModal
        user={user}
        opened={modals.resetPassword}
        onClose={() => setModals({ ...modals, resetPassword: false })}
      />

      <SendEmailModal
        user={user}
        opened={modals.sendEmail}
        onClose={() => setModals({ ...modals, sendEmail: false })}
      />

      <ChangeUserRoleModal
        user={user}
        opened={modals.userRole}
        onClose={() => setModals({ ...modals, userRole: false })}
      />

      <ChangeUserStatusModal
        user={user}
        opened={modals.userStatus}
        onClose={() => setModals({ ...modals, userStatus: false })}
      />
    </>
  );
};

export default Page;
