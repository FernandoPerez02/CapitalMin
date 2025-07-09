function calcularFilasVisibles(
  containerEl: HTMLElement | null,
  rowEl: HTMLElement | null,
  alturaReservada: number = 110 // espacio para encabezado/pie en px
): number {
  if (!containerEl || !rowEl) return 0;

  const containerHeight = containerEl.clientHeight;
  const rowHeight = rowEl.clientHeight || 1;

  const espacioDisponible = containerHeight - alturaReservada;

  const maxFilas = Math.floor(espacioDisponible / rowHeight);

  return maxFilas > 0 ? maxFilas : 0;
}

export { calcularFilasVisibles };