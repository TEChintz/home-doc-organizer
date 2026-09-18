import { getAccessToken } from "../supabase";

/**
 * Thin typed wrapper over the Docket API.
 *
 * Every error the API returns has the same shape:
 *   { error: { code: string, message: string, details?: unknown } }
 * so failures are normalised into ApiError and components can branch on `code`
 * rather than parsing messages.
 */

export const API_BASE = (
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "https://docket-api-pi.vercel.app"
).replace(/\/+$/, "");

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: string, status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }

  /**
   * The API answers 404 — never 403 — for anything outside your family, so a
   * 404 means "gone or not yours". Never render it as a permissions problem.
   */
  get isMissing(): boolean {
    return this.status === 404;
  }

  /** Signed in, but no member row yet: the user still has to create a family. */
  get needsFamily(): boolean {
    return this.status === 401 && /no member/i.test(this.message);
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** Set for multipart uploads; the browser must pick its own boundary. */
  formData?: FormData;
  signal?: AbortSignal;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = await getAccessToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  // Built conditionally: `exactOptionalPropertyTypes` rejects explicit undefined.
  const init: RequestInit = { method: options.method ?? "GET", headers };
  if (body !== undefined) init.body = body;
  if (options.signal) init.signal = options.signal;

  const res = await fetch(`${API_BASE}${path}`, init);

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const parsed: unknown = text ? safeJson(text) : null;

  if (!res.ok) {
    const err = (parsed as { error?: { code?: string; message?: string; details?: unknown } })
      ?.error;
    throw new ApiError(
      err?.code ?? "http_error",
      res.status,
      err?.message ?? `request failed (${res.status})`,
      err?.details,
    );
  }
  return parsed as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
