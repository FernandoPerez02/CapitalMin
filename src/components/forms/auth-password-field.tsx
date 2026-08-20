"use client";

import { InputHTMLAttributes, Ref, useState } from "react";
import AuthField from "./auth-field";
import { AUTH_FIELD_TOGGLE } from "./auth-form-classes";

type AuthPasswordFieldProps = {
  id: string;
  label: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function AuthPasswordField({ id, label, error, ...rest }: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthField
      id={id}
      label={label}
      icon="bi-lock"
      error={error}
      type={visible ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          className={AUTH_FIELD_TOGGLE}
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          <i className={`bi ${visible ? "bi-eye-slash" : "bi-eye"}`} aria-hidden="true" />
        </button>
      }
      {...rest}
    />
  );
}
