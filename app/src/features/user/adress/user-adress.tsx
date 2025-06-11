"use client";
import { UserAdressForm } from "./user-adress-form";
import { useSession } from "next-auth/react";

export const UserAdress = () => {
  const { data: session } = useSession();

  const handleAddressChange = async (newAddress: string) => {
    // Дополнительная логика при изменении адреса (если нужно)
    console.log("Адрес обновлен:", newAddress);
  };

  return (
    <UserAdressForm
      initialAddress={
        session?.user?.adress || "Вы ещё не указали адрес доставки"
      }
      onAddressChange={handleAddressChange}
      enableGeolocation={true}
    />
  );
};
