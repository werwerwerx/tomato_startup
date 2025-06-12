"use client";

import { UserAdressForm } from "./user-adress-form";
import { useUserAddress } from "../hooks/use-user-address";

export interface UserAdressProps {
  enableGeolocation?: boolean;
}

export const UserAdress = ({
  enableGeolocation = true,
}: UserAdressProps = {}) => {
  const { currentAddress, updateAddress, isUpdating, error } = useUserAddress();

  return (
    <UserAdressForm
      currentAddress={currentAddress}
      onAddressChange={updateAddress}
      isUpdating={isUpdating}
      error={error}
      enableGeolocation={enableGeolocation}
    />
  );
};
