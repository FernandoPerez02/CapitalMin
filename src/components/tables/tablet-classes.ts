export const TABLET_TITLE = "m-0 mb-3 text-base font-semibold text-text";

// El wrapper (no la <table>) es quien scrollea horizontalmente — así el
// contenido ancho hace scroll en vez de recortarse.
export const TABLE_WRAPPER =
  "hidden overflow-x-auto rounded-[10px] bg-surface shadow-[0_1px_2px_rgba(16,21,28,0.04),0_4px_12px_rgba(16,21,28,0.06)] md:block";
export const TABLE =
  "w-full border-collapse [&_tbody_tr:nth-child(even)]:bg-page-bg [&_tbody_tr:last-child>td]:border-b-0";
export const CARD_VIEW = "flex flex-col gap-3 md:hidden";

export const HEAD_CELL =
  "border-b border-border p-3 text-center text-sm font-semibold text-text-muted";
export const BODY_CELL = "border-b border-border p-3 text-center text-sm break-words text-text";

export const ROW_CARD_CLASSES = "flex flex-col gap-2";
export const ROW_CARD_FIELD = "flex justify-between gap-3 text-sm";
export const ROW_CARD_LABEL = "text-text-muted";
export const ROW_CARD_VALUE = "text-right text-text";

export const EMPTY_STATE = "flex flex-col items-center gap-2 py-8 px-4 text-text-muted";
export const EMPTY_ICON = "text-[28px]";
export const EMPTY_TEXT = "m-0 text-sm";

export const TABLE_TOGGLE =
  "mx-auto mt-3 block rounded-full border border-border bg-surface py-2 px-4 text-sm font-medium text-primary hover:bg-primary-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2";
