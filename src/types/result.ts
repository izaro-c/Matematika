export type Result<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export function success<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function failure<E = string>(error: E): Result<never, E> {
  return { ok: false, error };
}
