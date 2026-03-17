import { setAccessToken, getAccessToken } from "./api";

const TOKEN_KEY = "soc_token";

export function initAuth() {
  if (typeof window === "undefined") return;
  const stored = sessionStorage.getItem(TOKEN_KEY);
  if (stored) {
    setAccessToken(stored);
  }
}

export async function login(email: string, password: string): Promise<boolean> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://app.bbttransportes.com.br";

  const res = await fetch(`${apiUrl}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      grant_type: "password",
      client_id: process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_PASSPORT_CLIENT_SECRET,
      username: email,
      password,
      scope: "",
    }),
  });

  if (!res.ok) {
    return false;
  }

  const data = await res.json();
  const token = data.access_token;

  if (token) {
    setAccessToken(token);
    sessionStorage.setItem(TOKEN_KEY, token);
    return true;
  }

  return false;
}

export function logout() {
  setAccessToken(null);
  sessionStorage.removeItem(TOKEN_KEY);
  window.location.href = "/soc-dashboard/login";
}

export function isAuthenticated(): boolean {
  return !!getAccessToken() || !!sessionStorage.getItem(TOKEN_KEY);
}
