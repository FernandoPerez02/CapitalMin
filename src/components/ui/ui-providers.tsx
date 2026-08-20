"use client";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast/toast-context";
import { ConfirmProvider } from "@/components/ui/confirm-dialog/confirm-dialog-context";

export default function UiProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>{children}</ConfirmProvider>
    </ToastProvider>
  );
}
