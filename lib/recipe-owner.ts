const OWNER_KEY = "gramwise-recipe-owner-v1";

/** Stable id for this browser — recipes are private to this owner until auth exists. */
export function getRecipeOwnerId(): string {
  if (typeof window === "undefined") return "ssr";
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
