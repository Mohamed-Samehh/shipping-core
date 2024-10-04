# API reference

Reference of every public type, function and class exported by
`@helix/shipping-core`. Grouped by module.

## errors

```ts
export class ShippingError extends Error {
  readonly code: string;
  readonly context?: Record<string, unknown>;
}
```

All subclass exports: `NotFoundError`, `ConflictError`,
`PreconditionFailedError`, `UnauthorizedError`, `ForbiddenError`,
`RateLimitedError`, `IntegrityError`, `ValidationError`,
`CurrencyMismatchError`, `WeightOverflowError`,
`DimensionOverflowError`, `HazmatViolationError`,
`CustomsRequiredError`, `CarrierUnavailableError`,
`ServiceLevelInvalidError`, `ManifestClosedError`,
`TrackingNotIssuedError`, `LabelExpiredError`, `ReturnNotAllowedError`,
`WorkflowError`, `IdempotencyConflictError`, `WebhookSignatureError`,
`GatewayError`.

Plus the predicate:

```ts
export function isShippingError(value: unknown): value is ShippingError;
```

## config

```ts
export interface ShippingConfig {
  defaultCurrency: string;
  defaultWeightUnit: 'kg' | 'lb' | 'g' | 'oz';
  defaultDimensionUnit: 'cm' | 'in';
  defaultDimFactor: number;
  maxParcelWeightKg: number;
  maxParcelLongestSideCm: number;
  maxParcelGirthCm: number;
  maxParcelsPerShipment: number;
  manifestAutoCloseHours: number;
  labelExpiryDays: number;
  trackingPollIntervalSec: number;
  webhookMaxRetries: number;
  webhookRetryBackoffMs: number;
  rateCacheTtlMs: number;
}

export const DEFAULT_CONFIG: ShippingConfig;
export function mergeConfig(overrides: Partial<ShippingConfig>): ShippingConfig;
export function isFreightSize(longestSideCm: number, weightKg: number): boolean;
```

## lib/result

```ts
export type Result<T, E = Error>;
export function ok<T>(value: T): Ok<T>;
export function err<E>(error: E): Err<E>;
export function isOk<T, E>(result: Result<T, E>): result is Ok<T>;
export function isErr<T, E>(result: Result<T, E>): result is Err<E>;
export function mapResult<T, U, E>(result: Result<T, E>, fn: (v: T) => U): Result<U, E>;
export function mapError<T, E, F>(result: Result<T, E>, fn: (e: E) => F): Result<T, F>;
export function andThen<T, U, E>(result: Result<T, E>, fn: (v: T) => Result<U, E>): Result<U, E>;
export function unwrap<T, E>(result: Result<T, E>): T;
export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T;
export function unwrapOrElse<T, E>(result: Result<T, E>, fn: (e: E) => T): T;
export function tryAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>>;
export function trySync<T>(fn: () => T): Result<T, Error>;
export function collect<T, E>(results: readonly Result<T, E>[]): Result<T[], E>;
```

## lib/clock

```ts
export interface Clock { now(): number; iso(): string; }
export class SystemClock implements Clock;
export class FixedClock implements Clock {
  constructor(initial: number | string | Date);
  advance(ms: number): void;
  set(value: number | string | Date): void;
}
```

## lib/id

```ts
export interface IdGenerator { next(prefix?: string): string; }
export class CounterIdGenerator implements IdGenerator {
  constructor(defaultPrefix?: string);
  reset(): void;
  peek(prefix?: string): string;
}
export function shortId(seed: number, length?: number): string;
export function isShortId(value: string): boolean;
export function prefixedId(prefix: string, counter: number): string;
```

## lib/money

```ts
export interface Money { amount: bigint; currency: string; }
export function money(amount: number | bigint | string, currency: string): Money;
export function zero(currency: string): Money;
export function plus(a: Money, b: Money): Money;
export function minus(a: Money, b: Money): Money;
export function times(value: Money, factor: number | bigint): Money;
export function negate(value: Money): Money;
export function abs(value: Money): Money;
export function compare(a: Money, b: Money): number;
export function equal(a: Money, b: Money): boolean;
export function isPositive(value: Money): boolean;
export function isNegative(value: Money): boolean;
export function isZero(value: Money): boolean;
export function sum(values: readonly Money[], currency?: string): Money;
export function format(value: Money, options?: { withSymbol?: boolean }): string;
export function allocate(value: Money, parts: number): Money[];
export function allocateWeighted(value: Money, weights: readonly number[]): Money[];
```

## lib/weight + dimensions + dim-weight

```ts
export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';
export interface Weight { grams: number; }
export function weight(value: number, unit?: WeightUnit): Weight;
export function toUnit(w: Weight, unit: WeightUnit): number;
export function addWeight(a: Weight, b: Weight): Weight;

export type DimensionUnit = 'mm' | 'cm' | 'in';
export interface Dimensions { lengthMm: number; widthMm: number; heightMm: number; }
export function dimensions(l: number, w: number, h: number, unit?: DimensionUnit): Dimensions;
export function girth(d: Dimensions): number;
export function lengthPlusGirth(d: Dimensions): number;
export function volumeMm3(d: Dimensions): number;

export function dimensionalWeight(dim: Dimensions, dimFactor: number): Weight;
export function billableWeight(dim: Dimensions, actual: Weight, dimFactor: number): Weight;
```

## lib/postal-code + country + distance

```ts
export function isValidPostalCode(country: string, value: string): boolean;
export function normalisePostalCode(country: string, value: string): string;

export interface CountryInfo {
  code: string; name: string; currency: string;
  euMember: boolean; requiresCustoms: boolean; callingCode: string;
}
export function countryInfo(code: string): CountryInfo;
export function isKnownCountry(code: string): boolean;
export function requiresCustoms(origin: string, destination: string): boolean;

export interface LatLng { lat: number; lng: number; }
export function haversineKm(a: LatLng, b: LatLng): number;
export function nearest<T extends LatLng>(origin: LatLng, points: readonly T[]): T | undefined;
```

## domain modules

Every domain entity exports the schema, type, parse function and a few
predicates. Pattern:

```ts
// for entity X
export const XSchema: ZodSchema<X>;
export type X = z.infer<typeof XSchema>;
export function parseX(value: unknown): X;
// + entity-specific predicates (isXTerminal, canCancelX, ...)
```

All entities:

`Address`, `Carrier`, `Service`, `Account`, `Zone`, `PackageType`,
`Package`, `Shipment`, `ShipmentItem`, `Label`, `Manifest`,
`ManifestEntry`, `Rate`, `RateRequest`, `TrackingEvent`,
`CustomsDeclaration`, `CustomsItem`, `Surcharge`, `Discount`,
`PickupRequest`, `Return`, `DeliveryException`, `ProofOfDelivery`,
`Insurance`, `Contract`, `Quote`, `WebhookEndpoint`,
`WebhookDelivery`, `AuditEvent`, `Notification`, `Forecast`,
`ExportJob`, `Location`, `Customer`, `Route`, `RouteStop`,
`Vehicle`, `Driver`, `Tag`, `HazmatDeclaration`,
`SignatureRecord`, `DispatchSlot`, `ExceptionCode`.

## repository modules

Every domain entity has a matching repository extending `MemoryStore<T>`:

```ts
export abstract class MemoryStore<T extends HasId> {
  size(): number;
  clear(): void;
  get(id: string): T;
  tryGet(id: string): T | undefined;
  has(id: string): boolean;
  store(entity: T): T;
  remove(id: string): boolean;
  list(options?: ListOptions<T>): Page<T>;
  listAll(filter?: (item: T) => boolean): T[];
  count(filter?: (item: T) => boolean): number;
  protected addIndex(name: string, accessor: (item: T) => string | undefined): void;
  protected findByIndex(name: string, key: string): T[];
}
```

Concrete repositories add `findByX(value)` shortcuts for each secondary
index they register.

## service modules

All services follow the constructor injection pattern:

```ts
export class XService {
  constructor(
    private readonly repository: XRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateXInput): X;
  update(input: UpdateXInput): X;
  get(id: string): X;
  tryGet(id: string): X | undefined;
  list(): X[];
  remove(id: string, actor: string): void;
  // + entity-specific business methods
}
```

`AuditService` is special -- it's constructed first and threaded into
every other service so observable mutations land in the audit log.

## api modules

```ts
export class Router {
  get(path: string, handler: Handler): void;
  post(path: string, handler: Handler): void;
  put(path: string, handler: Handler): void;
  patch(path: string, handler: Handler): void;
  delete(path: string, handler: Handler): void;
  dispatch<B>(request: ApiRequest<B>): Promise<ApiResponse>;
}

export function authenticate<B>(
  request: ApiRequest<B>, lookup: ApiKeyLookup,
): AuthenticatedRequest<B>;

export function createServer(options: ApiServerOptions): Router;
```

The middleware layer:

```ts
export type Middleware = (
  request: ApiRequest,
  next: (request: ApiRequest) => Promise<ApiResponse>,
) => Promise<ApiResponse>;

export function compose(middlewares: readonly Middleware[]): (handler: Handler) => Handler;
export function withRequestId(generate: () => string): Middleware;
export function withIdempotency<T>(store: IdempotencyStore<T>): Middleware;
```
