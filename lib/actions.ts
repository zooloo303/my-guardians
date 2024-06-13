"use server";
import { cookies } from "next/headers";
import { TransferData, EquipData } from "./interfaces";

export async function handleLogin(userId: string) {
  cookies().set("session_userid", userId, {
    secure: false,
    maxAge: 60 * 60 * 24 * 7, // One week
    path: "/",
  });
}

export async function resetAuthCookies() {
  cookies().set("session_userid", "");
}

export async function getUserId() {
  const userId = cookies().get("session_userid")?.value;
  return userId ? userId : null;
}

export const transferItem = async (
  transferData: TransferData
): Promise<Response> => {
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
  return response;
};

export const equipItem = async (equipData: EquipData): Promise<Response> => {
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
  return response;
};
