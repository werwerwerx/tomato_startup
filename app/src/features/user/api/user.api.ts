import { AdressResponseDTO } from "@/app/api/user/adress/route";

export interface UpdateAddressRequest {
  address: string;
}

export interface AddressResponse extends AdressResponseDTO {}

export const userApi = {
  updateAddress: async (newAddress: string): Promise<AddressResponse> => {
    const response = await fetch("/api/user/adress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adress: newAddress }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Ошибка при обновлении адреса");
    }

    return await response.json();
  },
} as const;
