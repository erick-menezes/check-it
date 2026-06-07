---
paths: 
  - "src/**/*.jsx"
  - "src/**/*.tsx"
description: This file describes the React Native code style for the project.
---

# React Native

## Functional Components

Use functional components only; do not use class components.

**Example:**
```typescript
// 🚫 Avoid
class UserProfile extends React.Component {
  render() {
    return <Text>{this.props.name}</Text>;
  }
}

// ✅ Prefer
function UserProfile({ name }: { name: string }) {
  return <Text>{name}</Text>;
}

// Or as an arrow function (prefer the above for better readability and stack traces)
const UserProfile = ({ name }: { name: string }) => {
  return <Text>{name}</Text>;
};
```

## TypeScript

Use TypeScript and the `.tsx` extension for components.

**Example:**
```typescript
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

interface UserCardProps {
  name: string;
  email: string;
  avatar?: string;
}

export function UserCard({ name, email, avatar }: UserCardProps) {
  return (
    <View className="user-card">
      {avatar && <Image source={{ uri: avatar }} accessibilityLabel={name} />}
      <Text>{name}</Text>
      <Text>{email}</Text>
    </View>
  );
}
```

## Core Components

Never use web DOM elements (`div`, `span`, `p`, `img`, `button`). Always use React Native core components or platform equivalents.

**Example:**
```typescript
// 🚫 Avoid – web-only DOM elements
function Card() {
  return (
    <div>
      <img src="..." />
      <p>Hello</p>
      <button onClick={handlePress}>Tap</button>
    </div>
  );
}

// ✅ Prefer – React Native core components
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

function Card() {
  return (
    <View>
      <Image source={{ uri: '...' }} />
      <Text>Hello</Text>
      <Pressable onPress={handlePress}>
        <Text>Tap</Text>
      </Pressable>
    </View>
  );
}
```

## Local State

Keep component state as close as possible to where it is used.

**Example:**
```typescript
// 🚫 Avoid – parent holds state only used by child
function ParentComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <View>
      <UserProfile />
      <Settings isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </View>
  );
}

// ✅ Prefer – state handled by component that uses it
function ParentComponent() {
  return (
    <View>
      <UserProfile />
      <Settings />
    </View>
  );
}

function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // uses state locally
}
```

## Props Passing

Pass props explicitly. Avoid spreading props via `<Component {...props} />`. Only use prop spreading for custom wrapper components that explicitly take `...rest` and pass it to a core component (e.g., a styled button that wraps a native `Pressable`).

**Example:**
```typescript
// 🚫 Avoid
function UserProfile(props: any) {
  return <UserCard {...props} />;
}

// ✅ Prefer
interface UserProfileProps {
  name: string;
  email: string;
  avatar: string;
}

function UserProfile({ name, email, avatar }: UserProfileProps) {
  return <UserCard name={name} email={email} avatar={avatar} />;
}

// ✅ Acceptable for wrapper components
import { Pressable, type PressableProps, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface ButtonProps extends PressableProps {
  variant?: 'primary' | 'secondary';
  children: string;
}

function Button({ variant = 'primary', children, ...rest }: ButtonProps) {
  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
  };

  return (
    <Pressable className={cn('rounded-md px-4 py-2', variantClasses[variant])} {...rest}>
      <Text className="font-medium text-primary-foreground">{children}</Text>
    </Pressable>
  );
}
```

## Component Size

Avoid components longer than ~300 lines.

**Example:**
```typescript
// 🚫 Avoid – monolithic component
function Dashboard() {
  // 400 lines of code
  return (
    <View>
      {/* header */}
      {/* sidebar */}
      {/* content */}
      {/* footer */}
    </View>
  );
}

// ✅ Prefer – decompose into smaller pieces
function Dashboard() {
  return (
    <View>
      <DashboardHeader />
      <DashboardSidebar />
      <DashboardContent />
      <DashboardFooter />
    </View>
  );
}
```

## Context API

Use Context API when communicating between distant component branches. For app-wide state that changes frequently, prefer a dedicated store (the project uses `zustand`) to avoid unnecessary re-renders.

**Example:**
```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password);
    setUser(user);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

## Styling

Use NativeWind (`className`) for styling components. Do not use inline `StyleSheet` objects for styles that NativeWind can express, and never use web-only utilities (`hover:`, `cursor-*`, etc.). Compose conditional classes with the `cn` helper from `@/lib/utils`. Reach for `StyleSheet.create` only for dynamic values that cannot be expressed as utility classes.

**Example:**
```typescript
import { Pressable, Text } from 'react-native';
import { cn } from '@/lib/utils';

function Button({ variant = 'primary', children, ...rest }: ButtonProps) {
  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
  };

  return (
    <Pressable className={cn('rounded-md px-4 py-2', variantClasses[variant])} {...rest}>
      <Text className="font-medium text-primary-foreground">{children}</Text>
    </Pressable>
  );
}
```

## Component Granularity

Avoid creating too many small components. Use Composition sensibly – only split when customization or clarity requires it.

**Example:**
```typescript
// 🚫 Avoid – over-engineering
function UserName({ name }: { name: string }) {
  return <Text>{name}</Text>;
}

function UserEmail({ email }: { email: string }) {
  return <Text>{email}</Text>;
}

function UserCard({ name, email }: UserCardProps) {
  return (
    <View>
      <UserName name={name} />
      <UserEmail email={email} />
    </View>
  );
}

// ✅ Prefer – simplicity
function UserCard({ name, email }: UserCardProps) {
  return (
    <View>
      <Text>{name}</Text>
      <Text>{email}</Text>
    </View>
  );
}
```

## Lists

Render large or dynamic collections with `FlatList`/`SectionList` instead of mapping arrays inside a `ScrollView`. They virtualize rows, recycle views, and keep memory bounded. Always provide a stable `keyExtractor`.

**Example:**
```typescript
// 🚫 Avoid – renders every row at once
function ProductList({ products }: ProductListProps) {
  return (
    <ScrollView>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ScrollView>
  );
}

// ✅ Prefer – virtualized list
function ProductList({ products }: ProductListProps) {
  return (
    <FlatList
      data={products}
      keyExtractor={(product) => product.id}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
}
```

## Performance with `useMemo` and `useCallback`

Use `useMemo` to avoid expensive recalculations across renders, and `useCallback` for callbacks passed to memoized children or a list `renderItem`.

**Example:**
```typescript
function ProductList({ products, filter }: ProductListProps) {
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [products, filter]);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => <ProductCard product={item} />,
    [],
  );

  return (
    <FlatList
      data={filteredProducts}
      keyExtractor={(product) => product.id}
      renderItem={renderItem}
    />
  );
}
```

## Platform-Specific Code

Keep platform divergences out of component bodies. Prefer platform-specific file extensions (`.ios.tsx`, `.android.tsx`, `.web.tsx`) for whole-component differences, and `Platform.select` for small value differences.

**Example:**
```typescript
// 🚫 Avoid – branching scattered through the component
function Header() {
  return (
    <View style={{ paddingTop: Platform.OS === 'ios' ? 44 : 24 }}>
      {Platform.OS === 'web' ? <WebNav /> : <NativeNav />}
    </View>
  );
}

// ✅ Prefer – separate files resolved by the bundler
// header.tsx        -> shared / native implementation
// header.web.tsx    -> web implementation

// ✅ Prefer – Platform.select for small values
const paddingTop = Platform.select({ ios: 44, android: 24, default: 0 });
```

## Hook Naming

Name custom hooks with the `use` prefix, e.g., `useAuth`, `useStoredValue`, `useColorScheme`.

**Example:**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useStoredValue<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((item) => {
        if (item) setStoredValue(JSON.parse(item));
      })
      .catch((error) => console.error(error));
  }, [key]);

  const setValue = async (value: T) => {
    try {
      setStoredValue(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

function MyComponent() {
  const [theme, setTheme] = useStoredValue('theme', 'light');
}
```

## Component Libraries

Before building a complex component, consider whether an existing library makes sense. Prefer libraries built for React Native — never reach for web-only UI kits.

**Example:**
```
// For complex behavior, consider:
- expo-router            (file-based navigation)
- react-native-reanimated + react-native-gesture-handler (animations and gestures)
- react-native-safe-area-context (safe areas / notches)
- @rn-primitives/*       (accessible headless primitives)
- @expo/ui               (native UI building blocks)
- react-hook-form        (forms)
- @tanstack/react-query  (server state)
```

## Safe Areas

Respect device notches, status bars, and home indicators using `react-native-safe-area-context`. Do not hardcode status-bar offsets.

**Example:**
```typescript
// 🚫 Avoid – magic numbers per device
<View style={{ paddingTop: 44 }} />

// ✅ Prefer
import { SafeAreaView } from 'react-native-safe-area-context';

function Screen({ children }: { children: ReactNode }) {
  return <SafeAreaView className="flex-1">{children}</SafeAreaView>;
}
```

## Testing

Write automated tests for all components using `@testing-library/react-native`.

**Example:**
```typescript
import { render, screen } from '@testing-library/react-native';
import { UserCard } from './user-card';

describe('UserCard', () => {
  it('should render user information', () => {
    render(<UserCard name="John Doe" email="john@example.com" />);

    expect(screen.getByText('John Doe')).toBeOnTheScreen();
    expect(screen.getByText('john@example.com')).toBeOnTheScreen();
  });

  it('should render avatar when provided', () => {
    render(
      <UserCard
        name="John Doe"
        email="john@example.com"
        avatar="https://example.com/avatar.jpg"
      />,
    );

    expect(screen.getByLabelText('John Doe')).toBeOnTheScreen();
  });
});
```
