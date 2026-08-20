export interface Goal {
  id: string;
  name: string;
  emoji: string;
  currentAmount: number;
  targetAmount: number;
  // Aporte mensual que el usuario destina a esta meta — dato de usuario,
  // no derivado; alimenta el cálculo de distribución del dinero disponible.
  monthlyContribution: number;
}
