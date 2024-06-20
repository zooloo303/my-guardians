"use server";
import { cookies } from "next/headers";

export async function handleLogin(userId: string) {
  cookies().set("session_userid", userId, {
    secure: false,
    maxAge: 60 * 60 * 24 * 7, // One week
    path: "/",
  });
}

export async function resetAuthContext() {
  cookies().set("session_userid", "");
}

export async function getUserId() {
  const userId = cookies().get("session_userid")?.value;
  return userId ? userId : null;
}
