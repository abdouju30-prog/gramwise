export const DATA_CHANGED_EVENT = "gramwise-data-changed";

export function emitDataChanged(): void {
  if (typeof window === "undefined") return;
  if (typeof window.dispatchEvent !== "function") return;
  window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
}
