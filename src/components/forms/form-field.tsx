import {
  InputHTMLAttributes,
  ReactNode,
  Ref,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cx } from "@/lib/cx";
import {
  FIELD_ERROR,
  FORM_CONTROL,
  FORM_GROUP,
  FORM_LABEL,
  FORM_TEXTAREA_EXTRA,
} from "./form-classes";

type InputFieldProps = {
  as?: "input";
  id: string;
  label: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
} & InputHTMLAttributes<HTMLInputElement>;

type SelectFieldProps = {
  as: "select";
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  ref?: Ref<HTMLSelectElement>;
} & SelectHTMLAttributes<HTMLSelectElement>;

type TextareaFieldProps = {
  as: "textarea";
  id: string;
  label: string;
  error?: string;
  ref?: Ref<HTMLTextAreaElement>;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export type FormFieldProps = InputFieldProps | SelectFieldProps | TextareaFieldProps;

export default function FormField(props: FormFieldProps) {
  const { id, label, error } = props;

  if (props.as === "select") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as, id: _id, label: _label, error: _error, children, className, ...rest } = props;
    return (
      <div className={FORM_GROUP}>
        <select id={id} className={cx(FORM_CONTROL, className)} {...rest}>
          {children}
        </select>
        <label htmlFor={id} className={FORM_LABEL}>
          {label}
        </label>
        {error && <span className={FIELD_ERROR}>{error}</span>}
      </div>
    );
  }

  if (props.as === "textarea") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as, id: _id, label: _label, error: _error, className, ...rest } = props;
    return (
      <div className={FORM_GROUP}>
        <textarea
          id={id}
          placeholder=" "
          className={cx(FORM_CONTROL, FORM_TEXTAREA_EXTRA, className)}
          {...rest}
        />
        <label htmlFor={id} className={FORM_LABEL}>
          {label}
        </label>
        {error && <span className={FIELD_ERROR}>{error}</span>}
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { as, id: _id, label: _label, error: _error, className, ...rest } = props;
  return (
    <div className={FORM_GROUP}>
      <input id={id} placeholder=" " className={cx(FORM_CONTROL, className)} {...rest} />
      <label htmlFor={id} className={FORM_LABEL}>
        {label}
      </label>
      {error && <span className={FIELD_ERROR}>{error}</span>}
    </div>
  );
}
