export function Button({ children, onClick, disabled, className }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border px-4 py-2 bg-blue-100 hover:bg-blue-200 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
