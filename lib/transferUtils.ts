"use client";
import { TransferData, EquipData } from "./interfaces";

export const transferItem = async (
  transferData: TransferData
): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/user/bungie/post/transfer/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transferData),
    }
  );

  if (!response.ok) {
    throw new Error("Transfer failed");
  }
};

export const equipItem = async (equipData: EquipData): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/user/bungie/post/equip/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(equipData),
    }
  );

  if (!response.ok) {
    throw new Error("Equip failed");
  }
};
