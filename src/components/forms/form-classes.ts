// El formulario vive dentro de budget/movements page (`flex md:flex-row`) —
// md:flex-none + md:basis evita que compita por ancho con la tabla y fuerce
// scroll horizontal en laptop (ver Tablet/TABLE_WRAPPER para el otro lado del fix).
export const FORM_CARD =
  "relative w-full rounded-2xl bg-surface p-6 pb-[calc(var(--bottom-nav-height,64px)+72px)] text-center shadow-[0_1px_2px_rgba(16,21,28,0.04),0_4px_12px_rgba(16,21,28,0.06)] md:basis-[360px] md:flex-none md:pb-6";

export const FORM_CARD_HEADING = "p-4 text-2xl text-text";

export const FORM_GRID =
  "grid grid-cols-1 gap-3 md:grid-cols-2 md:[&>*:nth-last-child(1):nth-child(odd)]:col-span-2";

export const FORM_GROUP = "relative my-3";
export const FORM_CONTROL =
  "peer box-border min-h-11 w-full rounded-[10px] border border-border py-2 px-4 text-sm text-text focus:border-t-0 focus:border-b focus:outline-none valid:border-t-0 valid:border-b [&:not(:placeholder-shown)]:border-t-0 [&:not(:placeholder-shown)]:border-b";
export const FORM_TEXTAREA_EXTRA = "min-h-[88px] resize-y";
export const FORM_LABEL =
  "pointer-events-none absolute left-10 py-2 px-6 text-text-muted transition-all duration-200 ease-in-out peer-focus:-top-5 peer-focus:bg-surface peer-focus:text-sm peer-focus:text-primary peer-valid:-top-5 peer-valid:bg-surface peer-valid:text-sm peer-valid:text-primary peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:bg-surface peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-primary";
export const FIELD_ERROR = "mt-1 block pl-10 text-left text-xs text-danger";

export const FORM_CHECKBOX_LABEL =
  "flex cursor-pointer items-center gap-2 text-sm text-text-muted [&_input]:h-4 [&_input]:w-4 [&_input]:accent-primary";

export const GROUP_BTN =
  "fixed left-0 right-0 bottom-[var(--bottom-nav-height,64px)] z-[900] flex justify-end gap-6 border-t border-border bg-surface py-3 px-4 shadow-[0_-2px_8px_rgba(0,0,0,0.08)] [&_button:hover]:scale-110 [&_button:hover]:cursor-pointer [&_button:hover]:border-primary-dark [&_button:hover]:bg-primary-dark [&_button:hover]:text-text-inverse [&_button:hover]:transition-transform [&_button:hover]:duration-300 md:static md:m-0 md:mx-6 md:border-t-0 md:bg-transparent md:p-0 md:shadow-none";
