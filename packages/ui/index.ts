// Placeholder for shared UI components
// Components will be added here for reuse across apps

export * from './button';
export * from './input';
export * from './card';

// Button component
export const Button = ({ children, ...props }: any) => (
  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" {...props}>
    {children}
  </button>
);

// Input component
export const Input = (props: any) => (
  <input
    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
    {...props}
  />
);

// Card component
export const Card = ({ children, ...props }: any) => (
  <div className="bg-white rounded-lg shadow-md p-6" {...props}>
    {children}
  </div>
);
