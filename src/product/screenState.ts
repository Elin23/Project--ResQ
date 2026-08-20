export type ScreenLoadState = "loading" | "empty" | "error" | "ready";

export type ScreenStateModel<T> =
  | { state: "loading" }
  | { state: "empty"; data?: T }
  | { state: "error"; message: string }
  | { state: "ready"; data: T };

export function resolveCollectionState<T>(items: readonly T[], options?: { loading?: boolean; error?: string | null }): ScreenStateModel<readonly T[]> {
  if (options?.loading) return { state: "loading" };
  if (options?.error) return { state: "error", message: options.error };
  if (items.length === 0) return { state: "empty", data: items };
  return { state: "ready", data: items };
}
