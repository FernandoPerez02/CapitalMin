import { InputHTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "@/lib/cx";
import {
  AUTH_FIELD,
  AUTH_FIELD_CONTROL,
  AUTH_FIELD_ERROR,
  AUTH_FIELD_ICON,
  AUTH_FIELD_INPUT,
  AUTH_FIELD_INPUT_ERROR,
} from "./auth-form-classes";

type AuthFieldProps = {
  id: string;
  label: string;
  icon: string;
  error?: string;
  endAdornment?: ReactNode;
  ref?: Ref<HTMLInputElement>;
} & InputHTMLAttributes<HTMLInputElement>;

export default function AuthField({
  id,
  label,
  icon,
  error,
  endAdornment,
  ref,
  className,
  ...rest
}: AuthFieldProps) {
  return (
    <div className={AUTH_FIELD}>
      <label htmlFor={id}>{label}</label>
      <div className={AUTH_FIELD_CONTROL}>
        <i className={`bi ${icon} ${AUTH_FIELD_ICON}`} aria-hidden="true" />
        <input
          id={id}
          ref={ref}
          aria-invalid={Boolean(error)}
          className={cx(AUTH_FIELD_INPUT, error && AUTH_FIELD_INPUT_ERROR, className)}
          {...rest}
        />
        {endAdornment}
      </div>
      {error && <span className={AUTH_FIELD_ERROR}>{error}</span>}
    </div>
  );
}
