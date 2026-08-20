import { ButtonHTMLAttributes } from "react";

export default function Button({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`min-h-11 flex-1 rounded-md border border-border p-2 text-lg text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 md:w-32 md:flex-none ${className}`}
      {...props}
    />
  );
}
