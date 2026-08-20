export type LoadableState<T> =
  | { status: "idle"; data: T; error: null }
  | { status: "loading"; data: T; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: T; error: string };

export const initialLoadableState = <T>(data: T): LoadableState<T> => ({
  status: "idle",
  data,
  error: null,
});
