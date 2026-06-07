# Coding Standards

## Language

All source code must be written in English, including variable names, functions, classes, comments, and documentation.

**Example:**
```typescript
// 🚫 Avoid
const nomeDoProduto = "Laptop";
function calcularPreco() {}

// ✅ Prefer
const productName = "Laptop";
function calculatePrice() {}
```

## Naming Conventions

### camelCase
Use for methods, functions, and variables.

**Example:**
```typescript
const userName = "John";
const isActive = true;
function getUserById(id: string) {}
```

### PascalCase
Use for classes and interfaces.

**Example:**
```typescript
class UserRepository {}
interface PaymentGateway {}
```

### kebab-case
Use for files and directories.

**Example:**
```
user-repository.ts
payment-gateway.service.ts
api-controllers/
```

## Clear Naming

Avoid abbreviations, but don’t use names longer than ~30 characters.

**Example:**
```typescript
// 🚫 Avoid
const usrNm = "John";
const userNameFromDatabaseQueryResult = "John";

// ✅ Prefer
const userName = "John";
const dbUserName = "John";
```

## Constants and Magic Numbers

Declare constants to represent magic numbers and improve readability.

**Example:**
```typescript
// 🚫 Avoid
if (user.age >= 18) {}
setTimeout(() => {}, 3600000);

// ✅ Prefer
const MINIMUM_AGE = 18;
const ONE_HOUR_IN_MS = 60 * 60 * 1000;

if (user.age >= MINIMUM_AGE) {}
setTimeout(() => {}, ONE_HOUR_IN_MS);
```

## Methods and Functions

Methods and functions should perform a clear, single action, and their names should start with verbs, never nouns.

**Example:**
```typescript
// 🚫 Avoid
function user(id: string) {}
function userData() {}

// ✅ Prefer
function getUser(id: string) {}
function fetchUserData() {}
function createUser(data: UserData) {}
function updateUserEmail(id: string, email: string) {}
```

## Parameters

Avoid passing more than three parameters when possible; prefer objects if needed.

**Example:**
```typescript
// 🚫 Avoid
function createUser(name: string, email: string, age: number, address: string, phone: string) {}

// ✅ Prefer
interface CreateUserParams {
  name: string;
  email: string;
  age: number;
  address: string;
  phone: string;
}

function createUser(params: CreateUserParams) {}
```

## Side Effects

Avoid side effects. A method or function should either mutate or read, but avoid mixing both.

**Example:**
```typescript
// 🚫 Avoid
function getUsers() {
  const users = database.query("SELECT * FROM users");
  logger.log("Users fetched"); // side effect
  cache.set("users", users); // side effect
  return users;
}

// ✅ Prefer
function getUsers() {
  return database.query("SELECT * FROM users");
}

function fetchAndCacheUsers() {
  const users = getUsers();
  logger.log("Users fetched");
  cache.set("users", users);
  return users;
}
```

## Conditional Structures

Never nest more than two levels of `if/else`. Favor early returns instead.

**Example:**
```typescript
// 🚫 Avoid
function processPayment(user: User, amount: number) {
  if (user) {
    if (user.isActive) {
      if (amount > 0) {
        if (user.balance >= amount) {
          return completePayment(user, amount);
        }
      }
    }
  }
  return null;
}

// ✅ Prefer
function processPayment(user: User, amount: number) {
  if (!user) return null;
  if (!user.isActive) return null;
  if (amount <= 0) return null;
  if (user.balance < amount) return null;
  
  return completePayment(user, amount);
}
```

## Flag Parameters

Do not use flag parameters to toggle behavior. Extract separate methods for each behavior instead.

**Example:**
```typescript
// 🚫 Avoid
function getUser(id: string, includeOrders: boolean) {
  const user = database.getUser(id);
  if (includeOrders) {
    user.orders = database.getOrders(id);
  }
  return user;
}

// ✅ Prefer
function getUser(id: string) {
  return database.getUser(id);
}

function getUserWithOrders(id: string) {
  const user = getUser(id);
  user.orders = database.getOrders(id);
  return user;
}
```

## Method and Class Length

- Avoid methods longer than ~50 lines
- Avoid classes longer than ~300 lines

**Example:**
```typescript
// 🚫 Avoid
class UserService {
  // 500 lines of code
}

// ✅ Prefer
class UserAuthService {}
class UserProfileService {}
class UserNotificationService {}
```

## Formatting

Avoid blank lines inside methods and functions.

**Example:**
```typescript
// 🚫 Avoid
function calculateTotal(items: Item[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  
  const tax = subtotal * 0.1;
  
  return subtotal + tax;
}

// ✅ Prefer
function calculateTotal(items: Item[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.1;
  return subtotal + tax;
}
```

## Comments

Avoid comments whenever possible; code should be self-explanatory.

**Example:**
```typescript
// 🚫 Avoid
// Check if user is adult
if (user.age >= 18) {}

// ✅ Prefer
const isAdult = user.age >= MINIMUM_LEGAL_AGE;
if (isAdult) {}
```

## Variable Declarations

Never declare multiple variables on the same line.

**Example:**
```typescript
// 🚫 Avoid
const name = "John", age = 30, email = "john@example.com";

// ✅ Prefer
const name = "John";
const age = 30;
const email = "john@example.com";
```

## Variable Scope

Declare variables as close as possible to their usage.

**Example:**
```typescript
// 🚫 Avoid
function processOrder(orderId: string) {
  const user = getUser();
  const product = getProduct();
  const discount = calculateDiscount();
  
  validateOrder(orderId);
  checkInventory(orderId);
  
  // user is used only here, 5 lines later
  notifyUser(user);
}

// ✅ Prefer
function processOrder(orderId: string) {
  validateOrder(orderId);
  checkInventory(orderId);
  
  const user = getUser();
  notifyUser(user);
}
```
