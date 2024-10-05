// Middleware applied to every API request before the route handler runs.
// Order matters: idempotency-key short-circuits before validation, validation
// runs before the handler.

import { ApiRequest, ApiResponse, Handler } from './router';
import { IdempotencyStore } from '../lib/idempotency';

export type Middleware = (
  request: ApiRequest,
  next: (request: ApiRequest) => Promise<ApiResponse>,
) => Promise<ApiResponse>;

export function compose(middlewares: readonly Middleware[]): (handler: Handler) => Handler {
  return (handler) => async (request) => {
    let index = -1;
    const dispatch = async (i: number, req: ApiRequest): Promise<ApiResponse> => {
      if (i <= index) throw new Error('next() called multiple times');
      index = i;
      const mw = middlewares[i];
      if (mw) return mw(req, (next) => dispatch(i + 1, next));
      return handler(req);
    };
    return dispatch(0, request);
  };
}

export function withRequestId(generate: () => string): Middleware {
  return async (request, next) => {
    const id = request.headers['x-request-id'] ?? generate();
    const response = await next({ ...request, headers: { ...request.headers, 'x-request-id': id } });
    return { ...response, headers: { ...(response.headers ?? {}), 'x-request-id': id } };
  };
}

export function withIdempotency<T>(store: IdempotencyStore<T>): Middleware {
  return async (request, next) => {
    if (request.method === 'GET') return next(request);
    const key = request.headers['idempotency-key'];
    if (!key) return next(request);
    const found = store.lookup(key, request.body);
    if (found) return { status: 200, body: found.response as unknown };
    const response = await next(request);
    if (response.status >= 200 && response.status < 300) {
      store.remember(key, request.body, response.body as T);
    }
    return response;
  };
}
