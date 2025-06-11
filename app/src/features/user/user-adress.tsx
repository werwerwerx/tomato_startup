import { UserAdressForm } from "./adress/user-adress-form";

export const UserAdress = () => {
  return (
    <UserAdressForm 
      enableGeolocation={true}
    />
  );
};
