const AUTH_USER_KEY = "gramwise-auth-user-id";
const OWNER_KEY = "gramwise-recipe-owner-v1";

export function setAuthenticatedUserId(userId: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (userId) localStorage.setItem(AUTH_USER_KEY, userId);
    else localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    /* ignore */
  }
}

export function getAuthenticatedUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AUTH_USER_KEY);
  } catch {
    return null;
  }
}

/** Auth user id when signed in, else stable per-browser id. */
export function getRecipeOwnerId(): string {
  if (typeof window === "undefined") return "ssr";
  const authId = getAuthenticatedUserId();
  if (authId) return authId;
  try {
    let id = localStorage.getItem(OWNER_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(OWNER_KEY, id);
    }
    return id;
  } catch {
    return "fallback-owner";
  }
}
