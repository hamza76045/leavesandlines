export const READING_PROGRESS_KEY = "ll.reading-progress.v1";
export const READING_PROGRESS_EVENT = "ll-reading-progress";

export type BookProgress = {
  page: number;
  totalPages: number;
  zoom: number;
  fit: "width" | "page";
  /** Absent on records written before continuous scroll existed; reader defaults to "continuous". */
  mode?: "continuous" | "single";
  updatedAt: string;
};

export type ReadingProgressStore = Record<string, BookProgress>;

export function getProgressSnapshot() {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(READING_PROGRESS_KEY) ?? "";
  } catch {
    return "";
  }
}

export function parseProgress(snapshot = getProgressSnapshot()): ReadingProgressStore {
  try {
    const value = JSON.parse(snapshot || "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(
      Object.entries(value).filter((entry): entry is [string, BookProgress] => {
        const progress = entry[1] as Partial<BookProgress> | null;
        return Boolean(
          progress &&
          Number.isFinite(progress.page) &&
          Number.isFinite(progress.totalPages) &&
          Number.isFinite(progress.zoom) &&
          (progress.fit === "width" || progress.fit === "page") &&
          typeof progress.updatedAt === "string",
        );
      }),
    );
  } catch {
    return {};
  }
}

export function saveBookProgress(bookId: string, progress: BookProgress) {
  try {
    localStorage.setItem(
      READING_PROGRESS_KEY,
      JSON.stringify({ ...parseProgress(), [bookId]: progress }),
    );
    window.dispatchEvent(new Event(READING_PROGRESS_EVENT));
  } catch {}
}

export function clearBookProgress(bookId: string) {
  try {
    const store = parseProgress();
    delete store[bookId];
    localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event(READING_PROGRESS_EVENT));
  } catch {}
}

export function subscribeToProgress(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(READING_PROGRESS_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(READING_PROGRESS_EVENT, notify);
  };
}
