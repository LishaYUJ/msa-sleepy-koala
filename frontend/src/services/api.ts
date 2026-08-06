export interface ApiError {
  error: string;
  message: string;
}

export class CustomApiError extends Error {
  status: number;
  body: ApiError;

  constructor(status: number, body: ApiError) {
    super(body.message || `API Error got response status ${status}`);
    this.name = 'CustomApiError';
    this.status = status;
    this.body = body;
  }
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');

function resolveApiUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const path = url.startsWith('/') ? url : `/${url}`;
  return `${apiBaseUrl}${path}`;
}

async function request<T>(
  url: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(resolveApiUrl(url), {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return {} as T;
  }

  let body: any;
  try {
    body = await response.json();
  } catch (err) {
    body = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      try {
        import('../stores/useStore').then(({ useStore }) => {
          useStore.getState().logout();
        });
      } catch (err) {
        // Ignore resolution error
      }
    }
    const errorBody: ApiError = body || {
      error: 'UnknownError',
      message: 'An unexpected response was received from the server.'
    };
    throw new CustomApiError(response.status, errorBody);
  }

  return body as T;
}

export const api = {
  get<T>(url: string, token?: string): Promise<T> {
    return request<T>(url, { method: 'GET' }, token);
  },
  post<T>(url: string, body: any, token?: string): Promise<T> {
    return request<T>(url, { method: 'POST', body: JSON.stringify(body) }, token);
  },
  put<T>(url: string, body: any, token?: string): Promise<T> {
    return request<T>(url, { method: 'PUT', body: JSON.stringify(body) }, token);
  },
  delete<T>(url: string, token?: string): Promise<T> {
    return request<T>(url, { method: 'DELETE' }, token);
  },
};
