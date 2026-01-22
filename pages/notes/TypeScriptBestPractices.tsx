import React from "react";
import BlogPostLayout from "@/components/BlogPostLayout";

const TypeScriptBestPractices: React.FC = () => {
  return (
    <BlogPostLayout
      title="TypeScript Best Practices"
      date="January 15, 2024"
      category="Notes"
      tags={["TypeScript", "Best Practices", "Development"]}
    >
      <p>
        A collection of TypeScript patterns and practices I've refined over years
        of building production applications.
      </p>

      <h2>1. Prefer `unknown` Over `any`</h2>

      <pre>
        <code>{`// Bad: Using any
const processData = (data: any) => {
  return data.value; // No type safety
};

// Good: Using unknown with type guards
const processData = (data: unknown) => {
  if (isValidData(data)) {
    return data.value; // Type-safe access
  }
  throw new Error('Invalid data');
};`}</code>
      </pre>

      <h2>2. Use Discriminated Unions</h2>

      <pre>
        <code>{`// Powerful pattern for handling different states
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

const renderContent = <T>(state: AsyncState<T>) => {
  switch (state.status) {
    case 'idle':
      return <IdleState />;
    case 'loading':
      return <LoadingSpinner />;
    case 'success':
      return <Content data={state.data} />;
    case 'error':
      return <ErrorMessage error={state.error} />;
  }
};`}</code>
      </pre>

      <h2>3. Leverage Const Assertions</h2>

      <pre>
        <code>{`// Create literal types from objects
const ROUTES = {
  home: '/',
  about: '/about',
  blog: '/blog',
} as const;

type Route = typeof ROUTES[keyof typeof ROUTES];
// Type: "/" | "/about" | "/blog"`}</code>
      </pre>

      <h2>4. Use Template Literal Types</h2>

      <pre>
        <code>{`type EventName = 'click' | 'focus' | 'blur';
type Handler = \`on\${Capitalize<EventName>}\`;
// Type: "onClick" | "onFocus" | "onBlur"`}</code>
      </pre>

      <h2>5. Prefer Interfaces for Objects</h2>

      <pre>
        <code>{`// Interfaces are extendable and have better error messages
interface User {
  id: string;
  name: string;
  email: string;
}

interface AdminUser extends User {
  permissions: string[];
}`}</code>
      </pre>

      <h2>6. Use Branded Types for Type Safety</h2>

      <pre>
        <code>{`// Prevent mixing up similar types
type UserId = string & { readonly brand: unique symbol };
type OrderId = string & { readonly brand: unique symbol };

const createUserId = (id: string): UserId => id as UserId;
const createOrderId = (id: string): OrderId => id as OrderId;

// Now TypeScript prevents accidental misuse
const getUser = (id: UserId) => { /* ... */ };
getUser(createOrderId('123')); // Error!`}</code>
      </pre>

      <h2>Conclusion</h2>
      <p>
        These patterns have saved me countless hours of debugging and made my
        codebases significantly more maintainable.
      </p>
    </BlogPostLayout>
  );
};

export default TypeScriptBestPractices;
