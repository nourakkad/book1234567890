import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";

function getExpectedSecret() {
  return process.env.ADMIN_DASHBOARD_PASSWORD || "";
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  const session = store.get(SESSION_COOKIE)?.value;
  const expected = getExpectedSecret();
  if (!expected) return false;
  return session === expected;
}

export async function setAdminSession() {
  const expected = getExpectedSecret();
  if (!expected) return;
  const store = await cookies();
  store.set(SESSION_COOKIE, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function verifyAdminPassword(password: string) {
  const expected = getExpectedSecret();
  return Boolean(expected) && password === expected;
}
