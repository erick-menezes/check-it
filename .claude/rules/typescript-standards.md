---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
description: This file describes the TypeScript code style for the project.
---

# TypeScript

## Strict Mode

Always enable strict mode in `tsconfig.json`. Never disable strictness flags to silence errors.

**Example:**
```json
// 🚫 Avoid
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": false
  }
}

// ✅ Prefer
{
  "compilerOptions": {
    "strict": true
  }
}
```

## Explicit Types

Avoid using `any`. Prefer `unknown` when the type is truly unknown, then narrow it explicitly.

**Example:**
```typescript
// 🚫 Avoid
function parseResponse(data: any) {
  return data.user.name;
}

// ✅ Prefer
function parseResponse(data: unknown): string {
  if (
    typeof data === 'object' &&
    data !== null &&
    'user' in data &&
    typeof (data as { user: unknown }).user === 'object'
  ) {
    const user = (data as { user: { name: string } }).user;
    return user.name;
  }
  throw new Error('Invalid response shape');
}
```

## Type vs Interface

Use `interface` for object shapes and public contracts. Use `type` for unions, intersections, and primitives.

**Example:**
```typescript
// ✅ Interface for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Type for unions and computed types
type Status = 'active' | 'inactive' | 'pending';
type UserOrAdmin = User | Admin;
type PartialUser = Partial<User>;
```

## Enums

Prefer union types over `enum`. Enums add runtime overhead and can behave unexpectedly with reverse mappings.

**Example:**
```typescript
// 🚫 Avoid
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

// ✅ Prefer
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// ✅ Prefer const objects when you need iteration or a value map
const DIRECTION = {
  Up: 'UP',
  Down: 'DOWN',
  Left: 'LEFT',
  Right: 'RIGHT',
} as const;

type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];
```

## Non-Null Assertion

Avoid the non-null assertion operator (`!`). Use proper guards or optional chaining instead.

**Example:**
```typescript
// 🚫 Avoid
const name = user!.profile!.name;

// ✅ Prefer
const name = user?.profile?.name ?? 'Unknown';
```

## Type Assertions

Avoid `as` casts to silence type errors. Only cast after a runtime check that guarantees the shape.

**Example:**
```typescript
// 🚫 Avoid
const value = (response as SomeType).field;

// ✅ Prefer
function isSomeType(value: unknown): value is SomeType {
  return typeof value === 'object' && value !== null && 'field' in value;
}

if (isSomeType(response)) {
  const value = response.field;
}
```

## Utility Types

Leverage built-in utility types (`Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`) instead of redefining shapes manually.

**Example:**
```typescript
// 🚫 Avoid
interface UpdateUserParams {
  name?: string;
  email?: string;
  age?: number;
}

// ✅ Prefer
type UpdateUserParams = Partial<Pick<User, 'name' | 'email' | 'age'>>;
```

## Generics

Use generics to write reusable, type-safe functions. Constrain them when possible.

**Example:**
```typescript
// 🚫 Avoid – loses type information
function getFirstItem(list: any[]): any {
  return list[0];
}

// ✅ Prefer
function getFirstItem<T>(list: T[]): T | undefined {
  return list[0];
}

// ✅ Constrain when the generic must satisfy a shape
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## Function Return Types

Declare explicit return types on exported functions and methods. Rely on inference for internal helpers where the return type is obvious.

**Example:**
```typescript
// 🚫 Avoid on exported functions
export function calculateDiscount(price: number, rate: number) {
  return price * (1 - rate);
}

// ✅ Prefer
export function calculateDiscount(price: number, rate: number): number {
  return price * (1 - rate);
}
```

## Readonly

Mark data structures that should not be mutated as `readonly` or `Readonly<T>`.

**Example:**
```typescript
// 🚫 Avoid
interface Config {
  apiUrl: string;
  timeout: number;
}

// ✅ Prefer
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

// Or for arrays
function sumPrices(prices: readonly number[]): number {
  return prices.reduce((total, price) => total + price, 0);
}
```

## Discriminated Unions

Use discriminated unions to model states with mutually exclusive shapes instead of optional fields.

**Example:**
```typescript
// 🚫 Avoid
interface ApiState {
  isLoading: boolean;
  data?: User;
  error?: string;
}

// ✅ Prefer
type ApiState =
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string };

function renderState(state: ApiState) {
  if (state.status === 'loading') return 'Loading...';
  if (state.status === 'error') return state.error;
  return state.data.name;
}
```

## Nullish Coalescing and Optional Chaining

Use `??` and `?.` for safe access and default values instead of manual null checks.

**Example:**
```typescript
// 🚫 Avoid
const city = user && user.address && user.address.city ? user.address.city : 'Unknown';

// ✅ Prefer
const city = user?.address?.city ?? 'Unknown';
```

## Type Guards

Use type guard functions (with `value is Type` return) to narrow `unknown` or union types safely.

**Example:**
```typescript
// 🚫 Avoid
function processInput(input: string | number) {
  const value = input as string;
  return value.toUpperCase();
}

// ✅ Prefer
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processInput(input: string | number): string {
  if (isString(input)) return input.toUpperCase();
  return input.toFixed(2);
}
```

## Imports

Use named imports over default imports for better refactoring support and clarity.

**Example:**
```typescript
// 🚫 Avoid
import Utils from './utils';

// ✅ Prefer
import { formatDate, calculateTax } from './utils';
```

## Barrel Exports

Group related exports with an `index.ts` barrel file. Keep barrels flat — avoid re-exporting from other barrels to prevent circular dependencies.

**Example:**
```typescript
// src/services/index.ts
export { UserService } from './user-service';
export { OrderService } from './order-service';
export { PaymentService } from './payment-service';

// Elsewhere
import { UserService, OrderService } from '@/services';
```
