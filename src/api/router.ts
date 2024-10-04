// Tiny HTTP router. Production callers wire this into an Express / Fastify
// instance; the in-package tests use it directly via the `dispatch` helper.

import { ShippingError } from '../errors';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequest<B = unknown, P = Record<string, string>> {
  readonly method: Method;
  readonly path: string;
  readonly headers: Record<string, string>;
  readonly params: P;
  readonly query: Record<string, string>;
  readonly body: B;
}

export interface ApiResponse<T = unknown> {
  readonly status: number;
  readonly body: T;
  readonly headers?: Record<string, string>;
}

export type Handler<B = unknown, T = unknown> =
  (request: ApiRequest<B>) => Promise<ApiResponse<T>> | ApiResponse<T>;

interface RouteEntry {
  readonly method: Method;
  readonly pattern: RegExp;
  readonly paramNames: readonly string[];
  readonly handler: Handler;
}

export class Router {
  private readonly routes: RouteEntry[] = [];

  register(method: Method, path: string, handler: Handler): void {
    const paramNames: string[] = [];
    const re = new RegExp('^' + path.replace(/:[A-Za-z_]+/g, (m) => {
      paramNames.push(m.slice(1));
      return '([^/]+)';
    }) + '$');
    this.routes.push({ method, pattern: re, paramNames, handler });
  }

  get(path: string, handler: Handler): void { this.register('GET', path, handler); }
  post(path: string, handler: Handler): void { this.register('POST', path, handler); }
  put(path: string, handler: Handler): void { this.register('PUT', path, handler); }
  patch(path: string, handler: Handler): void { this.register('PATCH', path, handler); }
  delete(path: string, handler: Handler): void { this.register('DELETE', path, handler); }

  match(method: Method, path: string):
    { handler: Handler; params: Record<string, string> } | undefined {
    for (const route of this.routes) {
      if (route.method !== method) continue;
      const match = route.pattern.exec(path);
      if (!match) continue;
      const params: Record<string, string> = {};
      route.paramNames.forEach((name, i) => {
        params[name] = decodeURIComponent(match[i + 1] as string);
      });
      return { handler: route.handler, params };
    }
    return undefined;
  }

  async dispatch<B>(request: ApiRequest<B>): Promise<ApiResponse> {
    const matched = this.match(request.method, request.path);
    if (!matched) {
      return { status: 404, body: { code: 'ROUTE_NOT_FOUND', message: 'no route' } };
    }
    try {
      const withParams: ApiRequest<B> = { ...request, params: matched.params };
      return await matched.handler(withParams);
    } catch (error) {
      return errorToResponse(error);
    }
  }
}

export function errorToResponse(error: unknown): ApiResponse {
  if (error instanceof ShippingError) {
    const status = mapErrorStatus(error.code);
    return { status, body: { code: error.code, message: error.message, context: error.context } };
  }
  const message = error instanceof Error ? error.message : String(error);
  return { status: 500, body: { code: 'INTERNAL_ERROR', message } };
}

function mapErrorStatus(code: string): number {
  if (code.endsWith('_NOT_FOUND')) return 404;
  if (code.endsWith('_FORBIDDEN')) return 403;
  if (code.endsWith('_UNAUTHORIZED')) return 401;
  if (code.endsWith('_CONFLICT') || code.endsWith('_TAKEN')) return 409;
  if (code.endsWith('_INVALID') || code.endsWith('VALIDATION_FAILED')) return 400;
  if (code.endsWith('_RATE_LIMITED')) return 429;
  return 400;
}
