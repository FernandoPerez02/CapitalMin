"use client";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { EDITABLE_ERROR, EDITABLE_INPUT, EDITABLE_TRIGGER } from "./movements-table-classes";

interface Option {
  value: string;
  label: string;
}

interface MovementEditableFieldProps {
  value: string;
  displayNode: ReactNode;
  type: "text" | "number" | "date" | "select";
  options?: Option[];
  ariaLabel: string;
  validate: (raw: string) => string | null;
  onSave: (raw: string) => Promise<void>;
}

export default function MovementEditableField({
  value,
  displayNode,
  type,
  options,
  ariaLabel,
  validate,
  onSave,
}: MovementEditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
  const skipNextBlurRef = useRef(false);

  useEffect(() => {
    if (!isEditing) setDraft(value);
  }, [value, isEditing]);

  useEffect(() => {
    if (!isEditing || !inputRef.current) return;
    inputRef.current.focus();
    if (inputRef.current instanceof HTMLInputElement) {
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    setDraft(value);
    setError(null);
    setIsEditing(true);
  };

  const cancel = () => {
    skipNextBlurRef.current = true;
    setDraft(value);
    setError(null);
    setIsEditing(false);
  };

  const commit = async (raw: string) => {
    if (raw === value) {
      setIsEditing(false);
      setError(null);
      return;
    }
    const validationError = validate(raw);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      await onSave(raw);
      setIsEditing(false);
    } catch {
      setError("No se pudo guardar");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    }
  };

  if (!isEditing) {
    return (
      <span
        role="button"
        tabIndex={0}
        aria-label={`Editar ${ariaLabel}`}
        className={EDITABLE_TRIGGER}
        onClick={startEditing}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            startEditing();
          }
        }}
      >
        {displayNode}
      </span>
    );
  }

  return (
    <span className="inline-flex w-full flex-col items-stretch text-left">
      {type === "select" ? (
        <select
          ref={inputRef as React.Ref<HTMLSelectElement>}
          value={draft}
          disabled={isSaving}
          className={cx(EDITABLE_INPUT, error && "border-danger")}
          onChange={(event) => {
            setDraft(event.target.value);
            void commit(event.target.value);
          }}
          onBlur={() => {
            if (skipNextBlurRef.current) {
              skipNextBlurRef.current = false;
              return;
            }
            setIsEditing(false);
          }}
          onKeyDown={handleKeyDown}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          ref={inputRef as React.Ref<HTMLInputElement>}
          type={type === "number" ? "text" : type}
          inputMode={type === "number" ? "decimal" : undefined}
          value={draft}
          disabled={isSaving}
          className={cx(EDITABLE_INPUT, error && "border-danger")}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={(event) => {
            if (skipNextBlurRef.current) {
              skipNextBlurRef.current = false;
              return;
            }
            void commit(event.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
      )}
      {error && <span className={EDITABLE_ERROR}>{error}</span>}
    </span>
  );
}
